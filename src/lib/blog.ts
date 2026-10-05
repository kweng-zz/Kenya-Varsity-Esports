import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, resolve, extname } from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = resolve(process.cwd(), 'content/blog');
const UPLOADS_DIR = resolve(process.cwd(), 'public/uploads/blog');

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  slug: string;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
  featured: boolean;
  category: string;
  game: string;
  author: string;
  authorAvatar?: string;
  authorBio?: string;
  authorTwitter?: string;
  authorLinkedIn?: string;
  authorInstagram?: string;
  authorTikTok?: string;
  authorYouTube?: string;
  authorFacebook?: string;
  tags: string[];
  imageUrl?: string;
  image?: any;
  published: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

function validateSlug(slug: string): boolean {
  return /^[a-z0-9-]+$/.test(slug);
}

function ensureContentDir() {
  if (!existsSync(CONTENT_DIR)) {
    mkdirSync(CONTENT_DIR, { recursive: true });
  }
}

function ensureUploadsDir() {
  if (!existsSync(UPLOADS_DIR)) {
    mkdirSync(UPLOADS_DIR, { recursive: true });
  }
}

function readAllPosts(includeDrafts = false): BlogPost[] {
  ensureContentDir();
  const files = readdirSync(CONTENT_DIR).filter(f => extname(f) === '.md');
  
  const posts: BlogPost[] = files.map(file => {
    const filePath = join(CONTENT_DIR, file);
    const fileContent = readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);
    
    return {
      id: data.id || file.replace('.md', ''),
      title: data.title || '',
      description: data.description || '',
      content,
      slug: data.slug || file.replace('.md', ''),
      publishedAt: data.publishedAt || data.date || new Date().toISOString(),
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      featured: data.featured || false,
      category: data.category || 'General',
      game: data.game || '',
      author: data.author || 'KVE Team',
      authorAvatar: data.authorAvatar,
      authorBio: data.authorBio,
      authorTwitter: data.authorTwitter,
      authorLinkedIn: data.authorLinkedIn,
      authorInstagram: data.authorInstagram,
      authorTikTok: data.authorTikTok,
      authorYouTube: data.authorYouTube,
      authorFacebook: data.authorFacebook,
      tags: Array.isArray(data.tags) ? data.tags : [],
      imageUrl: data.imageUrl || data.coverImage,
      image: data.image,
      published: data.published !== false,
    };
  });

  if (!includeDrafts) {
    return posts.filter(p => p.published);
  }
  return posts;
}

function sortPosts(posts: BlogPost[]): BlogPost[] {
  return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getAllPosts(params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  game?: string;
  search?: string;
  featured?: boolean;
  includeDrafts?: boolean;
}): PaginatedResponse<BlogPost> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const includeDrafts = params?.includeDrafts || false;

  let posts = readAllPosts(includeDrafts);

  if (params?.category) {
    posts = posts.filter(p => p.category.toLowerCase() === params.category!.toLowerCase());
  }
  if (params?.game) {
    posts = posts.filter(p => p.game.toLowerCase() === params.game!.toLowerCase());
  }
  if (params?.search) {
    const search = params.search.toLowerCase();
    posts = posts.filter(p => 
      p.title.toLowerCase().includes(search) ||
      p.description.toLowerCase().includes(search) ||
      p.content.toLowerCase().includes(search)
    );
  }
  if (params?.featured !== undefined) {
    posts = posts.filter(p => p.featured === params.featured);
  }

  posts = sortPosts(posts);
  const total = posts.length;
  const pageCount = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  const data = posts.slice(start, start + pageSize);

  return {
    data,
    meta: {
      pagination: {
        page,
        pageSize,
        pageCount,
        total,
      },
    },
  };
}

export function getPostBySlug(slug: string, includeDrafts = false): BlogPost | null {
  if (!validateSlug(slug)) return null;
  
  ensureContentDir();
  const filePath = join(CONTENT_DIR, `${slug}.md`);
  
  if (!existsSync(filePath)) return null;

  const fileContent = readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  const post: BlogPost = {
    id: data.id || slug,
    title: data.title || '',
    description: data.description || '',
    content,
    slug: data.slug || slug,
    publishedAt: data.publishedAt || data.date || new Date().toISOString(),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString(),
    featured: data.featured || false,
    category: data.category || 'General',
    game: data.game || '',
    author: data.author || 'KVE Team',
    authorAvatar: data.authorAvatar,
    authorBio: data.authorBio,
    authorTwitter: data.authorTwitter,
    authorLinkedIn: data.authorLinkedIn,
    authorInstagram: data.authorInstagram,
    authorTikTok: data.authorTikTok,
    authorYouTube: data.authorYouTube,
    authorFacebook: data.authorFacebook,
    tags: Array.isArray(data.tags) ? data.tags : [],
    imageUrl: data.imageUrl || data.coverImage,
    image: data.image,
    published: data.published !== false,
  };

  if (!includeDrafts && !post.published) return null;
  return post;
}

export function getFeaturedArticles(limit = 3, includeDrafts = false): BlogPost[] {
  const posts = readAllPosts(includeDrafts);
  return sortPosts(posts).filter(p => p.featured).slice(0, limit);
}

export function getCategories(): string[] {
  const posts = readAllPosts(true);
  const categories = new Set(posts.map(p => p.category).filter(Boolean));
  return Array.from(categories).sort();
}

export function getGames(): string[] {
  const posts = readAllPosts(true);
  const games = new Set(posts.map(p => p.game).filter(Boolean));
  return Array.from(games).sort();
}

export function getAuthors(): string[] {
  const posts = readAllPosts(true);
  const authors = new Set(posts.map(p => p.author).filter(Boolean));
  return Array.from(authors).sort();
}

export function savePost(post: BlogPost): void {
  ensureContentDir();
  
  if (!validateSlug(post.slug)) {
    throw new Error('Invalid slug. Use only lowercase letters, numbers, and hyphens.');
  }

  const now = new Date().toISOString();
  const isNew = !existsSync(join(CONTENT_DIR, `${post.slug}.md`));
  
  const frontmatter = {
    id: post.id || post.slug,
    title: post.title,
    description: post.description,
    slug: post.slug,
    publishedAt: post.publishedAt || (isNew ? now : undefined),
    createdAt: post.createdAt || (isNew ? now : undefined),
    updatedAt: now,
    featured: post.featured || false,
    category: post.category || 'General',
    game: post.game || '',
    author: post.author || 'KVE Team',
    authorAvatar: post.authorAvatar,
    authorBio: post.authorBio,
    authorTwitter: post.authorTwitter,
    authorLinkedIn: post.authorLinkedIn,
    authorInstagram: post.authorInstagram,
    authorTikTok: post.authorTikTok,
    authorYouTube: post.authorYouTube,
    authorFacebook: post.authorFacebook,
    tags: post.tags || [],
    imageUrl: post.imageUrl,
    image: post.image,
    published: post.published !== false,
  };

  // Remove undefined values
  Object.keys(frontmatter).forEach(key => {
    if (frontmatter[key as keyof typeof frontmatter] === undefined) {
      delete frontmatter[key as keyof typeof frontmatter];
    }
  });

  const fileContent = matter.stringify(post.content, frontmatter);
  const filePath = join(CONTENT_DIR, `${post.slug}.md`);
  writeFileSync(filePath, fileContent, 'utf-8');
}

export function deletePost(slug: string): void {
  if (!validateSlug(slug)) {
    throw new Error('Invalid slug');
  }
  
  const filePath = join(CONTENT_DIR, `${slug}.md`);
  if (existsSync(filePath)) {
    const fs = require('fs');
    fs.unlinkSync(filePath);
  }
}

export function getAllSlugs(includeDrafts = false): string[] {
  const posts = readAllPosts(includeDrafts);
  return posts.map(p => p.slug);
}