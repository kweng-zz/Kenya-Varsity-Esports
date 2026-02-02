import { exec } from 'child_process';
import { promisify } from 'util';
import { PostgreSQLBlogDatabase } from './postgres-db';
import { getBlogDb } from './blog-db';

const execAsync = promisify(exec);

export interface MigrationOptions {
  dryRun?: boolean;
  batchSize?: number;
  continueOnError?: boolean;
}

/**
 * Migrates blog data from SQLite to PostgreSQL
 */
export class DatabaseMigrator {
  private postgresDB: PostgreSQLBlogDatabase;
  private sqliteDB = getBlogDb();

  constructor(private options: MigrationOptions = {}) {
    this.postgresDB = new PostgreSQLBlogDatabase();
  }

  async migrateAll(): Promise<{
    likesMigrated: number;
    commentsMigrated: number;
    bookmarksMigrated: number;
    viewsMigrated: number;
    followsMigrated: number;
    errors: string[];
  }> {
    console.log('🚀 Starting database migration from SQLite to PostgreSQL...');
    
    if (this.options.dryRun) {
      console.log('🔍 DRY RUN MODE - No data will be modified');
    }

    const results = {
      likesMigrated: 0,
      commentsMigrated: 0,
      bookmarksMigrated: 0,
      viewsMigrated: 0,
      followsMigrated: 0,
      errors: [] as string[]
    };

    const batchSize = this.options.batchSize || 1000;

    try {
      // Migrate in order of dependencies
      console.log('📊 Migrating article views...');
      results.viewsMigrated = await this.migrateViews(batchSize);

      console.log('❤️  Migrating article likes...');
      results.likesMigrated = await this.migrateLikes(batchSize);

      console.log('🔖 Migrating article bookmarks...');
      results.bookmarksMigrated = await this.migrateBookmarks(batchSize);

      console.log('💬 Migrating article comments...');
      results.commentsMigrated = await this.migrateComments(batchSize);

      console.log('👥 Migrating author follows...');
      results.followsMigrated = await this.migrateFollows(batchSize);

      console.log('✅ Migration completed successfully!');
      
    } catch (error) {
      const errorMessage = `Migration failed: ${error}`;
      console.error('❌', errorMessage);
      results.errors.push(errorMessage);
      
      if (!this.options.continueOnError) {
        throw error;
      }
    }

    return results;
  }

  private async migrateViews(batchSize: number): Promise<number> {
    let migrated = 0;
    
    try {
      // Get all views from SQLite
      const sqliteQuery = `
        SELECT article_id, view_count, last_viewed 
        FROM article_views
      `;
      
      const views = this.querySQLite(sqliteQuery);
      console.log(`Found ${views.length} views to migrate`);

      // Migrate in batches
      for (let i = 0; i < views.length; i += batchSize) {
        const batch = views.slice(i, i + batchSize);
        
        for (const view of batch) {
          try {
            await this.postgresDB.trackView(view.article_id);
            migrated++;
            
            if (migrated % 100 === 0) {
              console.log(`  Migrated ${migrated} views...`);
            }
          } catch (error) {
            console.error(`  Failed to migrate view ${view.article_id}:`, error);
          }
        }
        
        // Small delay to prevent overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
    } catch (error) {
      console.error('Error migrating views:', error);
      throw error;
    }
    
    return migrated;
  }

  private async migrateLikes(batchSize: number): Promise<number> {
    let migrated = 0;
    
    try {
      const sqliteQuery = `
        SELECT article_id, user_id, created_at 
        FROM article_likes
      `;
      
      const likes = this.querySQLite(sqliteQuery);
      console.log(`Found ${likes.length} likes to migrate`);

      for (let i = 0; i < likes.length; i += batchSize) {
        const batch = likes.slice(i, i + batchSize);
        
        for (const like of batch) {
          try {
            await this.postgresDB.toggleLike(like.article_id, like.user_id);
            migrated++;
            
            if (migrated % 100 === 0) {
              console.log(`  Migrated ${migrated} likes...`);
            }
          } catch (error) {
            console.error(`  Failed to migrate like for ${like.article_id}:`, error);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
    } catch (error) {
      console.error('Error migrating likes:', error);
      throw error;
    }
    
    return migrated;
  }

  private async migrateBookmarks(batchSize: number): Promise<number> {
    let migrated = 0;
    
    try {
      const sqliteQuery = `
        SELECT article_id, user_id, created_at 
        FROM article_bookmarks
      `;
      
      const bookmarks = this.querySQLite(sqliteQuery);
      console.log(`Found ${bookmarks.length} bookmarks to migrate`);

      for (let i = 0; i < bookmarks.length; i += batchSize) {
        const batch = bookmarks.slice(i, i + batchSize);
        
        for (const bookmark of batch) {
          try {
            await this.postgresDB.toggleBookmark(bookmark.article_id, bookmark.user_id);
            migrated++;
            
            if (migrated % 100 === 0) {
              console.log(`  Migrated ${migrated} bookmarks...`);
            }
          } catch (error) {
            console.error(`  Failed to migrate bookmark for ${bookmark.article_id}:`, error);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
    } catch (error) {
      console.error('Error migrating bookmarks:', error);
      throw error;
    }
    
    return migrated;
  }

  private async migrateComments(batchSize: number): Promise<number> {
    let migrated = 0;
    
    try {
      const sqliteQuery = `
        SELECT id, article_id, author_name, author_avatar, content, parent_id, created_at 
        FROM article_comments
        ORDER BY id
      `;
      
      const comments = this.querySQLite(sqliteQuery);
      console.log(`Found ${comments.length} comments to migrate`);

      for (let i = 0; i < comments.length; i += batchSize) {
        const batch = comments.slice(i, i + batchSize);
        
        for (const comment of batch) {
          try {
            await this.postgresDB.createComment(
              comment.article_id,
              comment.author_name,
              comment.content,
              comment.author_avatar,
              comment.parent_id
            );
            migrated++;
            
            if (migrated % 100 === 0) {
              console.log(`  Migrated ${migrated} comments...`);
            }
          } catch (error) {
            console.error(`  Failed to migrate comment ${comment.id}:`, error);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
    } catch (error) {
      console.error('Error migrating comments:', error);
      throw error;
    }
    
    return migrated;
  }

  private async migrateFollows(batchSize: number): Promise<number> {
    let migrated = 0;
    
    try {
      const sqliteQuery = `
        SELECT author_name, user_id, created_at 
        FROM author_follows
      `;
      
      const follows = this.querySQLite(sqliteQuery);
      console.log(`Found ${follows.length} follows to migrate`);

      for (let i = 0; i < follows.length; i += batchSize) {
        const batch = follows.slice(i, i + batchSize);
        
        for (const follow of batch) {
          try {
            await this.postgresDB.toggleFollow(follow.author_name, follow.user_id);
            migrated++;
            
            if (migrated % 100 === 0) {
              console.log(`  Migrated ${migrated} follows...`);
            }
          } catch (error) {
            console.error(`  Failed to migrate follow for ${follow.author_name}:`, error);
          }
        }
        
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      
    } catch (error) {
      console.error('Error migrating follows:', error);
      throw error;
    }
    
    return migrated;
  }

  private querySQLite(sql: string): any[] {
    try {
      // Using the SQLite database instance
      const db = (this.sqliteDB as any).db;
      if (!db) {
        throw new Error('SQLite database not available');
      }
      
      const stmt = db.prepare(sql);
      return stmt.all() || [];
    } catch (error) {
      console.error('SQLite query error:', error);
      return [];
    }
  }

  async verifyMigration(): Promise<{ 
    success: boolean; 
    mismatches: Array<{ table: string; sqliteCount: number; postgresCount: number }>;
  }> {
    console.log('🔍 Verifying migration...');
    
    const tables = ['article_likes', 'article_bookmarks', 'article_comments', 'article_views', 'author_follows'];
    const mismatches = [];

    for (const table of tables) {
      try {
        const sqliteCount = this.getSQLiteTableCount(table);
        const postgresCount = await this.getPostgresTableCount(table);
        
        console.log(`${table}: SQLite=${sqliteCount}, PostgreSQL=${postgresCount}`);
        
        if (sqliteCount !== postgresCount) {
          mismatches.push({
            table,
            sqliteCount,
            postgresCount
          });
        }
      } catch (error) {
        console.error(`Error verifying table ${table}:`, error);
      }
    }

    return {
      success: mismatches.length === 0,
      mismatches
    };
  }

  private getSQLiteTableCount(table: string): number {
    try {
      const db = (this.sqliteDB as any).db;
      if (!db) return 0;
      
      const stmt = db.prepare(`SELECT COUNT(*) as count FROM ${table}`);
      const result = stmt.get();
      return result?.count || 0;
    } catch (error) {
      console.error(`Error getting SQLite count for ${table}:`, error);
      return 0;
    }
  }

  private async getPostgresTableCount(table: string): Promise<number> {
    try {
      const query = `SELECT COUNT(*) as count FROM ${table}`;
      const result = await (this.postgresDB as any).pool.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error(`Error getting PostgreSQL count for ${table}:`, error);
      return 0;
    }
  }

  async createBackup(): Promise<string> {
    console.log('💾 Creating SQLite backup...');
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupPath = `data/blog-features-backup-${timestamp}.db`;
    
    try {
      const sqliteDB = (this.sqliteDB as any).db;
      if (!sqliteDB) {
        throw new Error('SQLite database not available for backup');
      }

      await execAsync(`copy data/blog-features.db "${backupPath}"`);
      console.log(`✅ Backup created: ${backupPath}`);
      
      return backupPath;
    } catch (error) {
      console.error('Failed to create backup:', error);
      throw error;
    }
  }

  async rollback(backupPath: string): Promise<void> {
    console.log('🔄 Rolling back to backup...');
    
    try {
      await execAsync(`copy "${backupPath}" data/blog-features.db`);
      console.log('✅ Rollback completed');
    } catch (error) {
      console.error('Rollback failed:', error);
      throw error;
    }
  }
}

// CLI interface for running migrations
export async function runMigrationCLI(options: MigrationOptions = {}): Promise<void> {
  const migrator = new DatabaseMigrator(options);
  
  try {
    // Create backup before migration
    const backupPath = await migrator.createBackup();
    
    // Run the migration
    const results = await migrator.migrateAll();
    
    // Verify the migration
    const verification = await migrator.verifyMigration();
    
    if (verification.success) {
      console.log('\n🎉 Migration completed successfully!');
      console.log('📊 Results:', {
        likesMigrated: results.likesMigrated,
        commentsMigrated: results.commentsMigrated,
        bookmarksMigrated: results.bookmarksMigrated,
        viewsMigrated: results.viewsMigrated,
        followsMigrated: results.followsMigrated
      });
    } else {
      console.log('\n⚠️  Migration completed with mismatches:');
      verification.mismatches.forEach(mismatch => {
        console.log(`  ${mismatch.table}: ${mismatch.sqliteCount} → ${mismatch.postgresCount}`);
      });
    }
    
    console.log(`\n💾 Backup saved at: ${backupPath}`);
    
    if (results.errors.length > 0) {
      console.log('\n❌ Errors occurred during migration:');
      results.errors.forEach(error => console.log(`  ${error}`));
    }
    
  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }
}