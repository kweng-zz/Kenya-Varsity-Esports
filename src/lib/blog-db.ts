import Database from 'better-sqlite3';
import { join } from 'path';
import { mkdirSync } from 'fs';
import { UniversalBlogDatabase } from './universal-db';

interface DatabaseConfig {
  type: 'sqlite' | 'postgresql' | 'appwrite';
  host?: string;
  port?: number;
  database?: string;
  user?: string;
  password?: string;
  ssl?: boolean;
  max?: number;
  idleTimeoutMillis?: number;
  connectionTimeoutMillis?: number;
}

// Database path
const DB_PATH = join(process.cwd(), 'data', 'blog-features.db');

// Ensure data directory exists
try {
  mkdirSync(join(process.cwd(), 'data'), { recursive: true });
} catch (error) {
  // Directory already exists
}

/**
 * Enhanced blog database with production-ready adapter
 */
class ProductionBlogDatabase {
  private adapter: UniversalBlogDatabase;

  constructor() {
    const dbType = process.env.DB_TYPE || 'sqlite';
    
    console.log(dbType === 'appwrite' ? 'Using Appwrite database for production' : 'Using local database for development');
    this.adapter = new UniversalBlogDatabase();
  }

  // Delegate all database methods to the appropriate adapter
  async getLikes(articleId?: string, userId?: string) {
    return this.adapter.getLikes(articleId, userId);
  }

  async toggleLike(articleId: string, userId: string): Promise<{ liked: boolean; totalLikes: number }> {
    return this.adapter.toggleLike(articleId, userId);
  }

  async getComments(articleId: string, page?: number, limit?: number) {
    return this.adapter.getComments(articleId, page, limit);
  }

  async createComment(articleId: string, authorName: string, content: string, authorAvatar?: string, parentId?: string) {
    return this.adapter.createComment(articleId, authorName, content, authorAvatar, parentId);
  }

  async getBookmarks(userId: string, page?: number, limit?: number) {
    return this.adapter.getBookmarks(userId, page, limit);
  }

  async isBookmarked(articleId: string, userId: string): Promise<boolean> {
    return this.adapter.isBookmarked(articleId, userId);
  }

  async toggleBookmark(articleId: string, userId: string): Promise<{ bookmarked: boolean }> {
    return this.adapter.toggleBookmark(articleId, userId);
  }

  async trackView(articleId: string): Promise<{ viewCount: number; lastViewed: number }> {
    return this.adapter.trackView(articleId);
  }

  async getViews(articleId: string): Promise<{ viewCount: number; lastViewed: number } | null> {
    return this.adapter.getViews(articleId);
  }

  async isFollowing(authorName: string, userId: string): Promise<boolean> {
    return this.adapter.isFollowing(authorName, userId);
  }

  async toggleFollow(authorName: string, userId: string): Promise<{ following: boolean; followerCount: number }> {
    return this.adapter.toggleFollow(authorName, userId);
  }

  async getFollowerCount(authorName: string): Promise<number> {
    return this.adapter.getFollowerCount(authorName);
  }

  async close(): Promise<void> {
    return this.adapter.close();
  }
}

export { ProductionBlogDatabase };

class BlogDatabase {
  private db: Database.Database | null = null;

  constructor() {
    this.init();
  }

  private init() {
    try {
      this.db = new Database(DB_PATH);
      this.db.pragma('journal_mode = WAL');
      this.createTables();
    } catch (error) {
      console.error('Failed to initialize blog database:', error);
    }
  }

  private createTables() {
    if (!this.db) return;

    // Article likes table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS article_likes (
        article_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (article_id, user_id)
      )
    `);

    // Article comments table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS article_comments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        article_id TEXT NOT NULL,
        author_name TEXT NOT NULL,
        author_avatar TEXT,
        content TEXT NOT NULL,
        parent_id INTEGER,
        created_at INTEGER NOT NULL,
        FOREIGN KEY (parent_id) REFERENCES article_comments(id) ON DELETE CASCADE
      )
    `);

    // Article bookmarks table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS article_bookmarks (
        article_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (article_id, user_id)
      )
    `);

    // Author follows table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS author_follows (
        author_name TEXT NOT NULL,
        user_id TEXT NOT NULL,
        created_at INTEGER NOT NULL,
        PRIMARY KEY (author_name, user_id)
      )
    `);

    // Article views table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS article_views (
        article_id TEXT PRIMARY KEY,
        view_count INTEGER NOT NULL DEFAULT 0,
        last_viewed INTEGER NOT NULL
      )
    `);

    // Create indexes for better performance
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON article_likes(article_id);
      CREATE INDEX IF NOT EXISTS idx_article_likes_user_id ON article_likes(user_id);
      CREATE INDEX IF NOT EXISTS idx_article_comments_article_id ON article_comments(article_id);
      CREATE INDEX IF NOT EXISTS idx_article_comments_parent_id ON article_comments(parent_id);
      CREATE INDEX IF NOT EXISTS idx_article_bookmarks_article_id ON article_bookmarks(article_id);
      CREATE INDEX IF NOT EXISTS idx_article_bookmarks_user_id ON article_bookmarks(user_id);
      CREATE INDEX IF NOT EXISTS idx_author_follows_author_name ON author_follows(author_name);
      CREATE INDEX IF NOT EXISTS idx_author_follows_user_id ON author_follows(user_id);
    `);

    console.log('Blog database tables initialized');
  }

  // Likes operations
  getLikes(articleId: string, userId?: string): { count: number; userLiked?: boolean } {
    if (!this.db) return { count: 0, userLiked: false };
 
    const count = this.db.prepare('SELECT COUNT(*) as count FROM article_likes WHERE article_id = ?').get(articleId) as { count: number };
    
    let userLiked = false;
    if (userId) {
      const existing = this.db.prepare('SELECT 1 FROM article_likes WHERE article_id = ? AND user_id = ?').get(articleId, userId);
      userLiked = !!existing;
    }
    
    return {
      count: count.count,
      userLiked
    };
  }

  toggleLike(articleId: string, userId: string): { liked: boolean; totalLikes: number } {
    if (!this.db) return { liked: false, totalLikes: 0 };

    const transaction = this.db.transaction(() => {
      // Check if already liked
      const existing = this.db!.prepare('SELECT 1 FROM article_likes WHERE article_id = ? AND user_id = ?').get(articleId, userId);
      
      if (existing) {
        // Remove like
        this.db!.prepare('DELETE FROM article_likes WHERE article_id = ? AND user_id = ?').run(articleId, userId);
        return { liked: false };
      } else {
        // Add like
        this.db!.prepare('INSERT INTO article_likes (article_id, user_id, created_at) VALUES (?, ?, ?)').run(
          articleId, userId, Date.now()
        );
        return { liked: true };
      }
    });

    const result = transaction();
    const totalLikes = this.getLikes(articleId).count;
    
    return {
      liked: result.liked,
      totalLikes
    };
  }

  // Comments operations
  getComments(articleId: string, page = 1, limit = 20): {
    comments: Array<{
      id: number;
      article_id: string;
      author_name: string;
      author_avatar?: string;
      content: string;
      parent_id?: number;
      created_at: number;
    }>;
    total: number;
    hasMore: boolean;
  } {
    if (!this.db) return { comments: [], total: 0, hasMore: false };

    const offset = (page - 1) * limit;
    
    const comments = this.db.prepare(`
      SELECT * FROM article_comments 
      WHERE article_id = ? AND parent_id IS NULL
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(articleId, limit, offset) as any[];

    // Get replies for each comment
    for (const comment of comments) {
      const replies = this.db.prepare(`
        SELECT * FROM article_comments 
        WHERE parent_id = ?
        ORDER BY created_at ASC
      `).all(comment.id) as any[];
      
      (comment as any).replies = replies;
    }

    const totalResult = this.db.prepare('SELECT COUNT(*) as count FROM article_comments WHERE article_id = ? AND parent_id IS NULL').get(articleId) as { count: number };
    const total = totalResult.count;
    const hasMore = offset + comments.length < total;

    return { comments, total, hasMore };
  }

  createComment(articleId: string, authorName: string, content: string, authorAvatar?: string, parentId?: number): {
    id: number;
    article_id: string;
    author_name: string;
    author_avatar?: string;
    content: string;
    parent_id?: number;
    created_at: number;
  } | null {
    if (!this.db) return null;

    try {
      const result = this.db.prepare(`
        INSERT INTO article_comments (article_id, author_name, author_avatar, content, parent_id, created_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(articleId, authorName, authorAvatar, content, parentId, Date.now());

      const comment = this.db.prepare('SELECT * FROM article_comments WHERE id = ?').get(result.lastInsertRowid) as any;
      return comment;
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    }
  }

  // Bookmarks operations
  getBookmarks(userId: string, page = 1, limit = 20): {
    bookmarks: Array<{
      article_id: string;
      user_id: string;
      created_at: number;
    }>;
    total: number;
    hasMore: boolean;
  } {
    if (!this.db) return { bookmarks: [], total: 0, hasMore: false };

    const offset = (page - 1) * limit;
    
    const bookmarks = this.db.prepare(`
      SELECT * FROM article_bookmarks 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `).all(userId, limit, offset) as any[];

    const totalResult = this.db.prepare('SELECT COUNT(*) as count FROM article_bookmarks WHERE user_id = ?').get(userId) as { count: number };
    const total = totalResult.count;
    const hasMore = offset + bookmarks.length < total;

    return { bookmarks, total, hasMore };
  }

  isBookmarked(articleId: string, userId: string): boolean {
    if (!this.db) return false;

    const result = this.db.prepare('SELECT 1 FROM article_bookmarks WHERE article_id = ? AND user_id = ?').get(articleId, userId);
    return !!result;
  }

  toggleBookmark(articleId: string, userId: string): { bookmarked: boolean } {
    if (!this.db) return { bookmarked: false };

    const transaction = this.db.transaction(() => {
      const existing = this.db!.prepare('SELECT 1 FROM article_bookmarks WHERE article_id = ? AND user_id = ?').get(articleId, userId);
      
      if (existing) {
        this.db!.prepare('DELETE FROM article_bookmarks WHERE article_id = ? AND user_id = ?').run(articleId, userId);
        return { bookmarked: false };
      } else {
        this.db!.prepare('INSERT INTO article_bookmarks (article_id, user_id, created_at) VALUES (?, ?, ?)').run(
          articleId, userId, Date.now()
        );
        return { bookmarked: true };
      }
    });

    return transaction();
  }

  // Views operations
  trackView(articleId: string): { viewCount: number; lastViewed: number } {
    if (!this.db) return { viewCount: 0, lastViewed: Date.now() };

    const transaction = this.db.transaction(() => {
      const existing = this.db!.prepare('SELECT view_count FROM article_views WHERE article_id = ?').get(articleId) as { view_count: number } | undefined;
      
      const now = Date.now();
      
      if (existing) {
        this.db!.prepare('UPDATE article_views SET view_count = view_count + 1, last_viewed = ? WHERE article_id = ?').run(now, articleId);
        return { viewCount: existing.view_count + 1, lastViewed: now };
      } else {
        this.db!.prepare('INSERT INTO article_views (article_id, view_count, last_viewed) VALUES (?, 1, ?)').run(articleId, now);
        return { viewCount: 1, lastViewed: now };
      }
    });

    return transaction();
  }

  getViews(articleId: string): { viewCount: number; lastViewed: number } | null {
    if (!this.db) return null;

    const result = this.db.prepare('SELECT view_count, last_viewed FROM article_views WHERE article_id = ?').get(articleId) as {
      view_count: number;
      last_viewed: number;
    } | undefined;

    return result ? { viewCount: result.view_count, lastViewed: result.last_viewed } : null;
  }

  // Author follow operations
  isFollowing(authorName: string, userId: string): boolean {
    if (!this.db) return false;

    const result = this.db.prepare('SELECT 1 FROM author_follows WHERE author_name = ? AND user_id = ?').get(authorName, userId);
    return !!result;
  }

  toggleFollow(authorName: string, userId: string): { following: boolean; followerCount: number } {
    if (!this.db) return { following: false, followerCount: 0 };

    const transaction = this.db.transaction(() => {
      const existing = this.db!.prepare('SELECT 1 FROM author_follows WHERE author_name = ? AND user_id = ?').get(authorName, userId);
      
      if (existing) {
        this.db!.prepare('DELETE FROM author_follows WHERE author_name = ? AND user_id = ?').run(authorName, userId);
        return { following: false };
      } else {
        this.db!.prepare('INSERT INTO author_follows (author_name, user_id, created_at) VALUES (?, ?, ?)').run(
          authorName, userId, Date.now()
        );
        return { following: true };
      }
    });

    const result = transaction();
    const followerCount = this.getFollowerCount(authorName);
    
    return {
      following: result.following,
      followerCount
    };
  }

  getFollowerCount(authorName: string): number {
    if (!this.db) return 0;

    const result = this.db.prepare('SELECT COUNT(*) as count FROM author_follows WHERE author_name = ?').get(authorName) as { count: number };
    return result.count;
  }

  getFollowingStatus(authorName: string, userId: string): {
    following: boolean;
    followerCount: number;
  } {
    const following = this.isFollowing(authorName, userId);
    const followerCount = this.getFollowerCount(authorName);
    
    return { following, followerCount };
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
    }
  }
}

// Singleton instance
let blogDbInstance: BlogDatabase | null = null;

export function getBlogDb(): BlogDatabase {
  if (!blogDbInstance) {
    blogDbInstance = new BlogDatabase();
  }
  return blogDbInstance;
}

// Export the class for testing
export { BlogDatabase };