#!/usr/bin/env node
/**
 * Contentful Migration Script
 * 
 * Fetches all articles from Contentful, converts Rich Text to Markdown,
 * downloads images, and writes .md files to content/blog/
 */

import { createClient } from 'contentful';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import fetch from 'node-fetch';

const CONTENTFUL_SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const CONTENTFUL_ACCESS_TOKEN = process.env.CONTENTFUL_ACCESS_TOKEN;
const CONTENTFUL_PREVIEW_TOKEN = process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
const CONTENTFUL_ENV = process.env.CONTENTFUL_ENVIRONMENT || 'master';

const CONTENT_DIR = join(process.cwd(), 'content/blog');
const UPLOADS_DIR = join(process.cwd(), 'public/uploads/blog');

if (!CONTENTFUL_SPACE_ID || !CONTENTFUL_ACCESS_TOKEN) {
  console.error('❌ Missing Contentful credentials. Set CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN in .env.local');
  process.exit(1);
}

function ensureDir(dir: string) {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9.-]/g, '_').substring(0, 100);
}

async function downloadImage(url: string, outputPath: string): Promise<boolean> {
  try {
    // Add protocol if missing
    if (url.startsWith('//')) {
      url = 'https:' + url;
    }
    
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const writeStream = createWriteStream(outputPath);
    await pipeline(response.body!, writeStream);
    return true;
  } catch (err) {
    console.warn(`  ⚠️ Failed to download ${url}: ${err instanceof Error ? err.message : err}`);
    return false;
  }
}

function richTextToMarkdown(richText: any): string {
  if (!richText || !richText.nodeType) return '';
  
  const renderNode = (node: any): string => {
    if (!node) return '';
    
    switch (node.nodeType) {
      case 'document':
        return node.content?.map(renderNode).join('\n\n') || '';
      case 'paragraph':
        return node.content?.map(renderNode).join('') || '';
      case 'heading-1':
        return '# ' + node.content?.map(renderNode).join('') + '\n';
      case 'heading-2':
        return '## ' + node.content?.map(renderNode).join('') + '\n';
      case 'heading-3':
        return '### ' + node.content?.map(renderNode).join('') + '\n';
      case 'heading-4':
        return '#### ' + node.content?.map(renderNode).join('') + '\n';
      case 'heading-5':
        return '##### ' + node.content?.map(renderNode).join('') + '\n';
      case 'heading-6':
        return '###### ' + node.content?.map(renderNode).join('') + '\n';
      case 'unordered-list':
        return node.content?.map(item => '- ' + renderNode(item)).join('\n') + '\n';
      case 'ordered-list':
        return node.content?.map((item, i) => `${i + 1}. ${renderNode(item)}`).join('\n') + '\n';
      case 'list-item':
        return node.content?.map(renderNode).join('') || '';
      case 'blockquote':
        return '> ' + node.content?.map(renderNode).join(' ') + '\n\n';
      case 'hr':
        return '---\n\n';
      case 'hyperlink':
        const url = node.data?.uri || '';
        const text = node.content?.map(renderNode).join('') || url;
        return `[${text}](${url})`;
      case 'asset-hyperlink':
        return node.content?.map(renderNode).join('') || '';
      case 'entry-hyperlink':
        return node.content?.map(renderNode).join('') || '';
      case 'asset-block':
        const assetUrl = node.data?.target?.fields?.file?.url;
        const alt = node.data?.target?.fields?.title || node.data?.target?.fields?.description || 'Image';
        if (assetUrl) {
          let url = assetUrl;
          if (url.startsWith('//')) url = 'https:' + url;
          return `![](${url})\n`;
        }
        return '';
      case 'embedded-entry-block':
      case 'embedded-entry-inline':
        return node.data?.target ? renderNode(node.data.target) : '';
      case 'text':
        let text = node.value || '';
        const marks = node.marks || [];
        for (const mark of marks) {
          switch (mark.type) {
            case 'bold': text = `**${text}**`; break;
            case 'italic': text = `*${text}*`; break;
            case 'underline': text = `<u>${text}</u>`; break;
            case 'code': text = `\`${text}\``; break;
            case 'superscript': text = `<sup>${text}</sup>`; break;
            case 'subscript': text = `<sub>${text}</sub>`; break;
          }
        }
        return text;
      default:
        console.warn(`Unknown node type: ${node.nodeType}`);
        return node.content?.map(renderNode).join('') || '';
    }
  };
  
  return renderNode(richText);
}

async function migrate() {
  console.log('🚀 Starting Contentful migration...');
  console.log(`   Space: ${CONTENTFUL_SPACE_ID}`);
  console.log(`   Environment: ${CONTENTFUL_ENV}`);
  
  ensureDir(CONTENT_DIR);
  ensureDir(UPLOADS_DIR);
  
  const client = createClient({
    space: CONTENTFUL_SPACE_ID,
    accessToken: CONTENTFUL_PREVIEW_TOKEN || CONTENTFUL_ACCESS_TOKEN,
    environment: CONTENTFUL_ENV,
    host: CONTENTFUL_PREVIEW_TOKEN ? 'preview.contentful.com' : undefined,
  });
  
  console.log('\n📥 Fetching all articles...');
  const response = await client.getEntries({
    content_type: 'article',
    limit: 1000,
    order: ['-sys.createdAt'],
  });
  
  console.log(`   Found ${response.total} articles`);
  
  let migrated = 0;
  let skipped = 0;
  
  for (const entry of response.items) {
    const f = entry.fields as any;
    const slug = f.slug || entry.sys.id;
    
    console.log(`\n📝 Processing: ${f.title} (${slug})`);
    
    // Check if already exists
    const mdPath = join(CONTENT_DIR, `${slug}.md`);
    if (existsSync(mdPath)) {
      console.log(`   ⏭️  Already exists, skipping`);
      skipped++;
      continue;
    }
    
    // Convert Rich Text to Markdown
    const markdownContent = f.content ? richTextToMarkdown(f.content) : '';
    
    // Download cover image
    let imageUrl = '';
    if (f.image?.fields?.file?.url) {
      const assetUrl = f.image.fields.file.url;
      let fullUrl = assetUrl;
      if (fullUrl.startsWith('//')) fullUrl = 'https:' + fullUrl;
      
      const ext = extname(fullUrl.split('?')[0]) || '.jpg';
      const imageName = `cover_${slug}${ext}`;
      const localPath = join(UPLOADS_DIR, imageName);
      
      console.log(`   📸 Downloading cover image...`);
      const downloaded = await downloadImage(fullUrl, localPath);
      if (downloaded) {
        imageUrl = `/uploads/blog/${imageName}`;
      } else {
        imageUrl = assetUrl.startsWith('//') ? 'https:' + assetUrl : assetUrl;
      }
    }
    
    // Download images from content
    // The richTextToMarkdown already handles asset-block conversion
    
    // Build frontmatter
    const frontmatter = {
      id: entry.sys.id,
      title: f.title || '',
      description: f.description || '',
      slug: slug,
      publishedAt: f.publishedAt || entry.sys.createdAt,
      createdAt: entry.sys.createdAt,
      updatedAt: entry.sys.updatedAt,
      featured: f.featured || false,
      category: f.category || 'General',
      game: f.game || '',
      author: f.author || 'KVE Team',
      authorAvatar: f.authorAvatar?.fields?.file?.url ? `https:${f.authorAvatar.fields.file.url}` : undefined,
      authorBio: f.authorBio,
      authorTwitter: f.authorTwitter,
      authorLinkedIn: f.authorLinkedIn,
      authorInstagram: f.authorInstagram,
      authorTikTok: f.authorTiktok || f.authorTikTok,
      authorYouTube: f.authorYouTube,
      authorFacebook: f.authorFacebook,
      tags: Array.isArray(f.tags) ? f.tags : [],
      imageUrl: imageUrl || (f.image?.fields?.file?.url ? `https:${f.image.fields.file.url}` : ''),
      published: true,
    };
    
    // Write markdown file
    const yaml = Object.entries(frontmatter)
      .filter(([, v]) => v !== undefined && v !== '')
      .map(([k, v]) => {
        if (Array.isArray(v)) {
          return `${k}: [${v.map(item => `"${item}"`).join(', ')}]`;
        }
        if (typeof v === 'string' && v.includes('\n')) {
          return `${k}: |\n  ${v.split('\n').join('\n  ')}`;
        }
        if (typeof v === 'string' && (v.includes(':') || v.includes('#') || v.includes('['))) {
          return `${k}: "${v}"`;
        }
        return `${k}: ${typeof v === 'string' ? `"${v}"` : v}`;
      })
      .join('\n');
    
    const fileContent = `---\n${yaml}\n---\n\n${markdownContent}`;
    
    writeFileSync(mdPath, fileContent, 'utf-8');
    console.log(`   ✅ Written to ${mdPath}`);
    migrated++;
  }
  
  console.log(`\n🎉 Migration complete!`);
  console.log(`   Migrated: ${migrated}`);
  console.log(`   Skipped:  ${skipped}`);
  console.log(`   Total:    ${response.total}`);
  console.log(`\n📁 Articles saved to: ${CONTENT_DIR}`);
  console.log(`📁 Images saved to:   ${UPLOADS_DIR}`);
  
  // Verify a few
  console.log('\n🔍 Verification:');
  const fs = require('fs');
  const files = fs.readdirSync(CONTENT_DIR).filter(f => f.endsWith('.md'));
  for (const file of files.slice(0, 3)) {
    const content = fs.readFileSync(join(CONTENT_DIR, file), 'utf-8');
    const hasFrontmatter = content.startsWith('---');
    const hasContent = content.length > 100;
    console.log(`   ${file}: frontmatter=${hasFrontmatter}, content=${hasContent}`);
  }
}

migrate().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});