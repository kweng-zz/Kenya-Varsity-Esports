import { Pool, PoolClient } from 'pg';
import { sanitizeInput } from './security';

interface BlogInteraction {
  articleId: string;
  isLiked: boolean;
  isBookmarked: boolean;
  likeCount: number;
  viewCount: number;
}

/**
 * PostgreSQL adapter for blog database operations
 */
export class PostgreSQLBlogDatabase {
  private pool: Pool;

  constructor() {
    if (!process.env.POSTGRES_URL) {
      throw new Error('POSTGRES_URL environment variable is required');
    }

    const isSupabase = process.env.POSTGRES_URL?.includes('supabase.co');
    
    this.pool = new Pool({
      connectionString: process.env.POSTGRES_URL,
      max: isSupabase ? 10 : 20, // Supabase recommends lower max connections
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 2000,
      ssl: isSupabase ? { rejectUnauthorized: false } : undefined, // Supabase SSL handling
    });

    console.log(`🗄️ Using ${isSupabase ? 'Supabase' : 'Local'} PostgreSQL database`);
    this.initializeTables();
  }

  private async initializeTables() {
    const createTables = `
      -- Article likes table
      CREATE TABLE IF NOT EXISTS article_likes (
        article_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        created_at BIGINT NOT NULL,
        PRIMARY KEY (article_id, user_id)
      );

      -- Article comments table
      CREATE TABLE IF NOT EXISTS article_comments (
        id SERIAL PRIMARY KEY,
        article_id VARCHAR(255) NOT NULL,
        author_name VARCHAR(100) NOT NULL,
        author_avatar VARCHAR(500),
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES article_comments(id) ON DELETE CASCADE,
        created_at BIGINT NOT NULL
      );

      -- Article bookmarks table
      CREATE TABLE IF NOT EXISTS article_bookmarks (
        article_id VARCHAR(255) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        created_at BIGINT NOT NULL,
        PRIMARY KEY (article_id, user_id)
      );

      -- Author follows table
      CREATE TABLE IF NOT EXISTS author_follows (
        author_name VARCHAR(100) NOT NULL,
        user_id VARCHAR(255) NOT NULL,
        created_at BIGINT NOT NULL,
        PRIMARY KEY (author_name, user_id)
      );

      -- Article views table
      CREATE TABLE IF NOT EXISTS article_views (
        article_id VARCHAR(255) PRIMARY KEY,
        view_count INTEGER NOT NULL DEFAULT 0,
        last_viewed BIGINT NOT NULL
      );

      -- Create indexes for better performance
      CREATE INDEX IF NOT EXISTS idx_article_likes_article_id ON article_likes(article_id);
      CREATE INDEX IF NOT EXISTS idx_article_likes_user_id ON article_likes(user_id);
      CREATE INDEX IF NOT EXISTS idx_article_comments_article_id ON article_comments(article_id);
      CREATE INDEX IF NOT EXISTS idx_article_comments_parent_id ON article_comments(parent_id);
      CREATE INDEX IF NOT EXISTS idx_article_bookmarks_article_id ON article_bookmarks(article_id);
      CREATE INDEX IF NOT EXISTS idx_article_bookmarks_user_id ON article_bookmarks(user_id);
      CREATE INDEX IF NOT EXISTS idx_author_follows_author_name ON author_follows(author_name);
      CREATE INDEX IF NOT EXISTS idx_author_follows_user_id ON author_follows(user_id);
    `;

    try {
      await this.pool.query(createTables);
      console.log('PostgreSQL tables initialized successfully');
    } catch (error) {
      console.error('Failed to initialize PostgreSQL tables:', error);
      throw error;
    }
  }

  // Likes operations
  async getLikes(articleId?: string, userId?: string): Promise<{ count: number; userLiked?: boolean }> {
    let query = 'SELECT COUNT(*) as count FROM article_likes';
    let params: any[] = [];

    if (articleId) {
      query += ' WHERE article_id = $1';
      params.push(articleId);
    }

    const result = await this.pool.query(query, params);
    const count = parseInt(result.rows[0].count);

    let userLiked = false;
    if (userId && articleId) {
      const userLikeResult = await this.pool.query(
        'SELECT 1 FROM article_likes WHERE article_id = $1 AND user_id = $2',
        [articleId, userId]
      );
      userLiked = userLikeResult.rows.length > 0;
    }

    return { count, userLiked };
  }

  async toggleLike(articleId: string, userId: string): Promise<{ liked: boolean; totalLikes: number }> {
    const client = await this.pool.connect();
    
    try {
      const sArticleId = sanitizeInput(articleId);
      const sUserId = sanitizeInput(userId);
      
      // Check if already liked
      const existing = await client.query(
        'SELECT 1 FROM article_likes WHERE article_id = $1 AND user_id = $2',
        [sArticleId, sUserId]
      );
      
      let liked: boolean;
      if (existing.rows.length > 0) {
        // Remove like
        await client.query(
          'DELETE FROM article_likes WHERE article_id = $1 AND user_id = $2',
          [sArticleId, sUserId]
        );
        liked = false;
      } else {
        // Add like
        await client.query(
          'INSERT INTO article_likes (article_id, user_id, created_at) VALUES ($1, $2, $3)',
          [sArticleId, sUserId, Date.now()]
        );
        liked = true;
      }
      
      await client.query('COMMIT');
      
      // Get total likes
      const totalResult = await this.getLikes(articleId);
      
      return {
        liked,
        totalLikes: totalResult.count
      };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Comments operations
  async getComments(articleId: string, page = 1, limit = 20): Promise<{
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
  }> {
    const offset = (page - 1) * limit;
    
    const commentsQuery = `
      SELECT * FROM article_comments 
      WHERE article_id = $1 AND parent_id IS NULL
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const commentsResult = await this.pool.query(commentsQuery, [articleId, limit, offset]);
    const comments = commentsResult.rows;

    // Get replies for each comment
    for (const comment of comments) {
      const repliesQuery = `
        SELECT * FROM article_comments 
        WHERE parent_id = $1
        ORDER BY created_at ASC
      `;
      const repliesResult = await this.pool.query(repliesQuery, [comment.id]);
      comment.replies = repliesResult.rows;
    }

    const totalResult = await this.pool.query(
      'SELECT COUNT(*) as count FROM article_comments WHERE article_id = $1 AND parent_id IS NULL',
      [articleId]
    );
    const total = parseInt(totalResult.rows[0].count);
    const hasMore = offset + comments.length < total;

    return { comments, total, hasMore };
  }

  async createComment(
    articleId: string, 
    authorName: string, 
    content: string, 
    authorAvatar?: string, 
    parentId?: string | number
  ): Promise<{
    id: number;
    article_id: string;
    author_name: string;
    author_avatar?: string;
    content: string;
    parent_id?: number;
    created_at: number;
  } | null> {
    const sArticleId = sanitizeInput(articleId);
    const sAuthorName = sanitizeInput(authorName);
    const sContent = sanitizeInput(content);
    const sAuthorAvatar = authorAvatar ? sanitizeInput(authorAvatar) : undefined;
    const client = await this.pool.connect();
    
    try {
      const parentIdVal = parentId ? Number(parentId) : null;
      
      const result = await client.query(
        `INSERT INTO article_comments 
         (article_id, author_name, author_avatar, content, parent_id, created_at) 
         VALUES ($1, $2, $3, $4, $5, $6)
         RETURNING *`,
        [sArticleId, sAuthorName, sAuthorAvatar, sContent, parentIdVal, Date.now()]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error('Error creating comment:', error);
      return null;
    } finally {
      client.release();
    }
  }

  // Bookmarks operations
  async getBookmarks(userId: string, page = 1, limit = 20): Promise<{
    bookmarks: Array<{
      article_id: string;
      user_id: string;
      created_at: number;
    }>;
    total: number;
    hasMore: boolean;
  }> {
    const offset = (page - 1) * limit;
    
    const query = `
      SELECT * FROM article_bookmarks 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;
    
    const result = await this.pool.query(query, [userId, limit, offset]);
    const bookmarks = result.rows;

    const totalResult = await this.pool.query(
      'SELECT COUNT(*) as count FROM article_bookmarks WHERE user_id = $1',
      [userId]
    );
    const total = parseInt(totalResult.rows[0].count);
    const hasMore = offset + bookmarks.length < total;

    return { bookmarks, total, hasMore };
  }

  async isBookmarked(articleId: string, userId: string): Promise<boolean> {
    const result = await this.pool.query(
      'SELECT 1 FROM article_bookmarks WHERE article_id = $1 AND user_id = $2',
      [articleId, userId]
    );
    
    return result.rows.length > 0;
  }

  async toggleBookmark(articleId: string, userId: string): Promise<{ bookmarked: boolean }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const sArticleId = sanitizeInput(articleId);
      const sUserId = sanitizeInput(userId);

      // Check if already bookmarked
      const existing = await client.query(
        'SELECT 1 FROM article_bookmarks WHERE article_id = $1 AND user_id = $2',
        [sArticleId, sUserId]
      );
      
      let bookmarked: boolean;
      if (existing.rows.length > 0) {
        // Remove bookmark
        await client.query(
          'DELETE FROM article_bookmarks WHERE article_id = $1 AND user_id = $2',
          [sArticleId, sUserId]
        );
        bookmarked = false;
      } else {
        // Add bookmark
        await client.query(
          'INSERT INTO article_bookmarks (article_id, user_id, created_at) VALUES ($1, $2, $3)',
          [sArticleId, sUserId, Date.now()]
        );
        bookmarked = true;
      }
      
      await client.query('COMMIT');
      return { bookmarked };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  // Views operations
  async trackView(articleId: string): Promise<{ viewCount: number; lastViewed: number }> {
    const client = await this.pool.connect();
    
    try {
      const sArticleId = sanitizeInput(articleId);
      const result = await client.query(
        `INSERT INTO article_views (article_id, view_count, last_viewed) 
         VALUES ($1, 1, $2) 
         ON CONFLICT (article_id) DO UPDATE 
         SET view_count = article_views.view_count + 1, last_viewed = $2
         RETURNING view_count, last_viewed`,
        [sArticleId, Date.now()]
      );
      
      return {
        viewCount: result.rows[0].view_count,
        lastViewed: result.rows[0].last_viewed
      };
    } catch (error) {
      console.error('Error tracking view:', error);
      throw error;
    } finally {
      client.release();
    }
  }

  async getViews(articleId: string): Promise<{ viewCount: number; lastViewed: number } | null> {
    const result = await this.pool.query(
      'SELECT view_count, last_viewed FROM article_views WHERE article_id = $1',
      [articleId]
    );
    
    return result.rows.length > 0 ? result.rows[0] : null;
  }

  // Author follow operations
  async isFollowing(authorName: string, userId: string): Promise<boolean> {
    const result = await this.pool.query(
      'SELECT 1 FROM author_follows WHERE author_name = $1 AND user_id = $2',
      [authorName, userId]
    );
    
    return result.rows.length > 0;
  }

  async toggleFollow(authorName: string, userId: string): Promise<{ following: boolean; followerCount: number }> {
    const client = await this.pool.connect();
    
    try {
      await client.query('BEGIN');
      
      const sAuthorName = sanitizeInput(authorName);
      const sUserId = sanitizeInput(userId);

      // Check if already following
      const existing = await client.query(
        'SELECT 1 FROM author_follows WHERE author_name = $1 AND user_id = $2',
        [sAuthorName, sUserId]
      );
      
      let following: boolean;
      if (existing.rows.length > 0) {
        // Remove follow
        await client.query(
          'DELETE FROM author_follows WHERE author_name = $1 AND user_id = $2',
          [authorName, userId]
        );
        following = false;
      } else {
        // Add follow
        await client.query(
          'INSERT INTO author_follows (author_name, user_id, created_at) VALUES ($1, $2, $3)',
          [authorName, userId, Date.now()]
        );
        following = true;
      }
      
      await client.query('COMMIT');
      
      // Get follower count
      const followerCount = await this.getFollowerCount(authorName);
      
      return { following, followerCount };
      
    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  }

  async getFollowerCount(authorName: string): Promise<number> {
    const result = await this.pool.query(
      'SELECT COUNT(*) as count FROM author_follows WHERE author_name = $1',
      [authorName]
    );
    
    return parseInt(result.rows[0].count);
  }

  async getFollowingStatus(authorName: string, userId: string): Promise<{
    following: boolean;
    followerCount: number;
  }> {
    const following = await this.isFollowing(authorName, userId);
    const followerCount = await this.getFollowerCount(authorName);
    
    return { following, followerCount };
  }

  async close(): Promise<void> {
    await this.pool.end();
  }

  // Health check method
  async healthCheck(): Promise<{ status: string; timestamp: number; connectionCount: number }> {
    try {
      const result = await this.pool.query('SELECT NOW() as timestamp, COUNT(*) as connection_count FROM pg_stat_activity');
      return {
        status: 'healthy',
        timestamp: new Date(result.rows[0].timestamp).getTime(),
        connectionCount: parseInt(result.rows[0].connection_count)
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        timestamp: Date.now(),
        connectionCount: 0
      };
    }
  }
}