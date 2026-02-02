import { ID, Databases, Query } from 'appwrite';
import { PostgreSQLBlogDatabase } from './postgres-db';

interface BlogDatabaseAdapter {
  getLikes: (articleId: string, userId?: string) => Promise<{ count: number; userLiked?: boolean }>;
  toggleLike: (articleId: string, userId: string) => Promise<{ liked: boolean; totalLikes: number }>;
  getComments: (articleId: string, page?: number, limit?: number) => Promise<any>;
  createComment: (articleId: string, authorName: string, content: string, authorAvatar?: string, parentId?: string | number) => Promise<any>;
  getBookmarks: (userId: string, page?: number, limit?: number) => Promise<any>;
  isBookmarked: (articleId: string, userId: string) => Promise<boolean>;
  toggleBookmark: (articleId: string, userId: string) => Promise<{ bookmarked: boolean }>;
  trackView: (articleId: string) => Promise<{ viewCount: number; lastViewed: number }>;
  getViews: (articleId: string) => Promise<{ viewCount: number; lastViewed: number } | null>;
  isFollowing: (authorName: string, userId: string) => Promise<boolean>;
  toggleFollow: (authorName: string, userId: string) => Promise<{ following: boolean; followerCount: number }>;
  getFollowerCount: (authorName: string) => Promise<number>;
  close: () => void | Promise<void>;
}

/**
 * Appwrite database adapter for production use
 * Since you use Appwrite as your database, this provides a production-ready interface
 */
class AppwriteAdapter implements BlogDatabaseAdapter {
  private databases: Databases;
  private databaseId: string;
  private likesCollectionId: string;
  private commentsCollectionId: string;
  private bookmarksCollectionId: string;
  private followsCollectionId: string;
  private viewsCollectionId: string;

  constructor() {
    // Initialize Appwrite client
    const { Client, Databases } = require('appwrite');
    const client = new Client()
      .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
      .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || 'your-project-id');
    
    this.databases = new Databases(client);
    this.databaseId = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'kuer-blogs';
    
    // Collection IDs for blog features
    this.likesCollectionId = 'article_likes';
    this.commentsCollectionId = 'article_comments';
    this.bookmarksCollectionId = 'article_bookmarks';
    this.followsCollectionId = 'author_follows';
    this.viewsCollectionId = 'article_views';
    
    console.log('Using Appwrite database adapter');
  }

  private async ensureCollections() {
    try {
      // Note: Collection management methods may need adjustment based on Appwrite version
      const collections = [
        this.likesCollectionId,
        this.commentsCollectionId,
        this.bookmarksCollectionId,
        this.followsCollectionId,
        this.viewsCollectionId
      ];

      // Skip collection creation for build - collections should be manually created
      // console.log('Collections configured:', collections);
    } catch (error) {
      console.error('Error ensuring Appwrite collections:', error);
    }
  }

  async getLikes(articleId: string, userId?: string) {
    try {
      await this.ensureCollections();
      
      // Get total likes
      const totalLikesQuery = Query.equal('articleId', articleId);
      const totalLikesResult = await this.databases.listDocuments(
        this.databaseId,
        this.likesCollectionId,
        [totalLikesQuery]
      );
      
      let userLiked = false;
      if (userId) {
        // Check if user liked this article
        const userLikeQuery = [
          Query.equal('articleId', articleId),
          Query.equal('userId', userId)
        ];
        const userLikeResult = await this.databases.listDocuments(
          this.databaseId,
          this.likesCollectionId,
          userLikeQuery
        );
        userLiked = userLikeResult.documents.length > 0;
      }
      
      return {
        count: totalLikesResult.documents.length,
        userLiked
      };
    } catch (error) {
      console.error('Appwrite getLikes error:', error);
      return { count: 0, userLiked: false };
    }
  }

  async toggleLike(articleId: string, userId: string): Promise<{ liked: boolean; totalLikes: number }> {
    try {
      await this.ensureCollections();
      
      // Check if already liked
      const existingLikeQuery = [
        Query.equal('articleId', articleId),
        Query.equal('userId', userId)
      ];
      const existingLike = await this.databases.listDocuments(
        this.databaseId,
        this.likesCollectionId,
        existingLikeQuery
      );
      
      if (existingLike.documents.length > 0) {
        // Remove like
        await this.databases.deleteDocument(
          this.databaseId,
          this.likesCollectionId,
          existingLike.documents[0].$id
        );
        
        // Get updated count
        const totalLikesQuery = Query.equal('articleId', articleId);
        const totalLikesResult = await this.databases.listDocuments(
          this.databaseId,
          this.likesCollectionId,
          [totalLikesQuery]
        );
        
        return {
          liked: false,
          totalLikes: totalLikesResult.documents.length
        };
      } else {
        // Add like
        await this.databases.createDocument(
          this.databaseId,
          this.likesCollectionId,
          ID.unique(),
          {
            articleId,
            userId,
            createdAt: new Date().toISOString()
          }
        );
        
        // Get updated count
        const totalLikesQuery = Query.equal('articleId', articleId);
        const totalLikesResult = await this.databases.listDocuments(
          this.databaseId,
          this.likesCollectionId,
          [totalLikesQuery]
        );
        
        return {
          liked: true,
          totalLikes: totalLikesResult.documents.length
        };
      }
    } catch (error) {
      console.error('Appwrite toggleLike error:', error);
      throw error;
    }
  }

  async getComments(articleId: string, page = 1, limit = 20) {
    try {
      await this.ensureCollections();
      
      const offset = (page - 1) * limit;
      const commentsQuery = [
        Query.equal('articleId', articleId),
        Query.isNull('parentId'),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ];
      
      const result = await this.databases.listDocuments(
        this.databaseId,
        this.commentsCollectionId,
        commentsQuery
      );
      
      // Get replies for each comment
      const comments = await Promise.all(
        result.documents.map(async (comment: any) => {
          const repliesQuery = [
            Query.equal('parentId', comment.$id),
            Query.orderAsc('createdAt')
          ];
          
          const repliesResult = await this.databases.listDocuments(
            this.databaseId,
            this.commentsCollectionId,
            repliesQuery
          );
          
          return {
            ...comment,
            replies: repliesResult.documents
          };
        })
      );
      
      return {
        comments,
        total: result.total,
        hasMore: offset + limit < result.total
      };
    } catch (error) {
      console.error('Appwrite getComments error:', error);
      return { comments: [], total: 0, hasMore: false };
    }
  }

  async createComment(articleId: string, authorName: string, content: string, authorAvatar?: string, parentId?: string | number) {
    try {
      await this.ensureCollections();
      
      const commentData: any = {
        articleId,
        authorName,
        content,
        createdAt: new Date().toISOString(),
        authorAvatar: authorAvatar || undefined,
        parentId: parentId ? String(parentId) : undefined
      };
      
      if (authorAvatar) {
        commentData.authorAvatar = authorAvatar;
      }
      
      if (parentId) {
        commentData.parentId = parentId;
      }
      
      const result = await this.databases.createDocument(
        this.databaseId,
        this.commentsCollectionId,
        ID.unique(),
        commentData
      );
      
      return result;
    } catch (error) {
      console.error('Appwrite createComment error:', error);
      throw error;
    }
  }

  async getBookmarks(userId: string, page = 1, limit = 20) {
    try {
      await this.ensureCollections();
      
      const offset = (page - 1) * limit;
      const bookmarksQuery = [
        Query.equal('userId', userId),
        Query.orderDesc('createdAt'),
        Query.limit(limit),
        Query.offset(offset)
      ];
      
      const result = await this.databases.listDocuments(
        this.databaseId,
        this.bookmarksCollectionId,
        bookmarksQuery
      );
      
      return {
        bookmarks: result.documents,
        total: result.total,
        hasMore: offset + limit < result.total
      };
    } catch (error) {
      console.error('Appwrite getBookmarks error:', error);
      return { bookmarks: [], total: 0, hasMore: false };
    }
  }

  async isBookmarked(articleId: string, userId: string): Promise<boolean> {
    try {
      await this.ensureCollections();
      
      const bookmarkQuery = [
        Query.equal('articleId', articleId),
        Query.equal('userId', userId)
      ];
      
      const result = await this.databases.listDocuments(
        this.databaseId,
        this.bookmarksCollectionId,
        bookmarkQuery
      );
      
      return result.documents.length > 0;
    } catch (error) {
      console.error('Appwrite isBookmarked error:', error);
      return false;
    }
  }

  async toggleBookmark(articleId: string, userId: string): Promise<{ bookmarked: boolean }> {
    try {
      await this.ensureCollections();
      
      // Check if already bookmarked
      const existingBookmarkQuery = [
        Query.equal('articleId', articleId),
        Query.equal('userId', userId)
      ];
      const existingBookmark = await this.databases.listDocuments(
        this.databaseId,
        this.bookmarksCollectionId,
        existingBookmarkQuery
      );
      
      if (existingBookmark.documents.length > 0) {
        // Remove bookmark
        await this.databases.deleteDocument(
          this.databaseId,
          this.bookmarksCollectionId,
          existingBookmark.documents[0].$id
        );
        
        return { bookmarked: false };
      } else {
        // Add bookmark
        await this.databases.createDocument(
          this.databaseId,
          this.bookmarksCollectionId,
          ID.unique(),
          {
            articleId,
            userId,
            createdAt: new Date().toISOString()
          }
        );
        
        return { bookmarked: true };
      }
    } catch (error) {
      console.error('Appwrite toggleBookmark error:', error);
      throw error;
    }
  }

  async trackView(articleId: string): Promise<{ viewCount: number; lastViewed: number }> {
    try {
      await this.ensureCollections();
      
      const viewQuery = Query.equal('articleId', articleId);
      const existingView = await this.databases.listDocuments(
        this.databaseId,
        this.viewsCollectionId,
        [viewQuery]
      );
      
      const now = Date.now();
      
      if (existingView.documents.length > 0) {
        // Update existing view
        const viewDoc = existingView.documents[0];
        await this.databases.updateDocument(
          this.databaseId,
          this.viewsCollectionId,
          viewDoc.$id,
          {
            viewCount: viewDoc.viewCount + 1,
            lastViewed: now
          }
        );
        
        return {
          viewCount: viewDoc.viewCount + 1,
          lastViewed: now
        };
      } else {
        // Create new view record
        await this.databases.createDocument(
          this.databaseId,
          this.viewsCollectionId,
          ID.unique(),
          {
            articleId,
            viewCount: 1,
            lastViewed: now
          }
        );
        
        return {
          viewCount: 1,
          lastViewed: now
        };
      }
    } catch (error) {
      console.error('Appwrite trackView error:', error);
      return { viewCount: 0, lastViewed: Date.now() };
    }
  }

  async getViews(articleId: string): Promise<{ viewCount: number; lastViewed: number } | null> {
    try {
      await this.ensureCollections();
      
      const viewQuery = Query.equal('articleId', articleId);
      const result = await this.databases.listDocuments(
        this.databaseId,
        this.viewsCollectionId,
        [viewQuery]
      );
      
      if (result.documents.length === 0) {
        return null;
      }
      
      const viewDoc = result.documents[0];
      return {
        viewCount: viewDoc.viewCount || 0,
        lastViewed: viewDoc.lastViewed || Date.now()
      };
    } catch (error) {
      console.error('Appwrite getViews error:', error);
      return null;
    }
  }

  async isFollowing(authorName: string, userId: string): Promise<boolean> {
    try {
      await this.ensureCollections();
      
      const followQuery = [
        Query.equal('authorName', authorName),
        Query.equal('userId', userId)
      ];
      
      const result = await this.databases.listDocuments(
        this.databaseId,
        this.followsCollectionId,
        followQuery
      );
      
      return result.documents.length > 0;
    } catch (error) {
      console.error('Appwrite isFollowing error:', error);
      return false;
    }
  }

  async toggleFollow(authorName: string, userId: string): Promise<{ following: boolean; followerCount: number }> {
    try {
      await this.ensureCollections();
      
      // Check if already following
      const existingFollowQuery = [
        Query.equal('authorName', authorName),
        Query.equal('userId', userId)
      ];
      const existingFollow = await this.databases.listDocuments(
        this.databaseId,
        this.followsCollectionId,
        existingFollowQuery
      );
      
      if (existingFollow.documents.length > 0) {
        // Unfollow
        await this.databases.deleteDocument(
          this.databaseId,
          this.followsCollectionId,
          existingFollow.documents[0].$id
        );
        
        // Get updated follower count
        const followerCountQuery = Query.equal('authorName', authorName);
        const followerCountResult = await this.databases.listDocuments(
          this.databaseId,
          this.followsCollectionId,
          [followerCountQuery]
        );
        
        return {
          following: false,
          followerCount: followerCountResult.documents.length
        };
      } else {
        // Follow
        await this.databases.createDocument(
          this.databaseId,
          this.followsCollectionId,
          ID.unique(),
          {
            authorName,
            userId,
            createdAt: new Date().toISOString()
          }
        );
        
        // Get updated follower count
        const followerCountQuery = Query.equal('authorName', authorName);
        const followerCountResult = await this.databases.listDocuments(
          this.databaseId,
          this.followsCollectionId,
          [followerCountQuery]
        );
        
        return {
          following: true,
          followerCount: followerCountResult.documents.length
        };
      }
    } catch (error) {
      console.error('Appwrite toggleFollow error:', error);
      throw error;
    }
  }

  async getFollowerCount(authorName: string): Promise<number> {
    try {
      await this.ensureCollections();
      
      const followerCountQuery = Query.equal('authorName', authorName);
      const result = await this.databases.listDocuments(
        this.databaseId,
        this.followsCollectionId,
        [followerCountQuery]
      );
      
      return result.documents.length;
    } catch (error) {
      console.error('Appwrite getFollowerCount error:', error);
      return 0;
    }
  }

  close(): void {
    // Appwrite client doesn't need explicit closing
    console.log('Appwrite database adapter closed');
  }
}

/**
 * Universal database adapter that manages transitions between database strategies
 */
class UniversalBlogDatabase {
  private adapter: BlogDatabaseAdapter;

  constructor() {
    const dbType = process.env.DB_TYPE || 'appwrite';
    
    switch (dbType) {
      case 'postgresql':
      case 'postgres':
        console.log('Using PostgreSQL database for production');
        this.adapter = new PostgreSQLBlogDatabase();
        break;
      case 'appwrite':
      default:
        console.log(`Using Appwrite database for production (type=${dbType})`);
        this.adapter = new AppwriteAdapter();
        break;
    }
  }

  // Delegate all methods to the selected adapter
  getLikes(articleId?: string, userId?: string) {
    return this.adapter.getLikes(articleId || '', userId || '');
  }

  toggleLike(articleId: string, userId: string) {
    return this.adapter.toggleLike(articleId, userId);
  }

  getComments(articleId: string, page?: number, limit?: number) {
    return this.adapter.getComments(articleId, page, limit);
  }

  createComment(articleId: string, authorName: string, content: string, authorAvatar?: string, parentId?: string) {
    return this.adapter.createComment(articleId, authorName, content, authorAvatar, parentId);
  }

  getBookmarks(userId: string, page?: number, limit?: number) {
    return this.adapter.getBookmarks(userId, page, limit);
  }

  isBookmarked(articleId: string, userId: string) {
    return this.adapter.isBookmarked(articleId, userId);
  }

  toggleBookmark(articleId: string, userId: string) {
    return this.adapter.toggleBookmark(articleId, userId);
  }

  trackView(articleId: string) {
    return this.adapter.trackView(articleId);
  }

  getViews(articleId: string) {
    return this.adapter.getViews(articleId);
  }

  isFollowing(authorName: string, userId: string) {
    return this.adapter.isFollowing(authorName, userId);
  }

  toggleFollow(authorName: string, userId: string) {
    return this.adapter.toggleFollow(authorName, userId);
  }

  getFollowerCount(authorName: string) {
    return this.adapter.getFollowerCount(authorName);
  }

  close() {
    return this.adapter.close();
  }
}

export { UniversalBlogDatabase, AppwriteAdapter };
export default UniversalBlogDatabase;