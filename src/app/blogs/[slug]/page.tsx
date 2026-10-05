import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllSlugs } from '@/lib/blog';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { BlogPostContent } from '@/components/pages/blogs/BlogPostContent';

interface BlogPost {
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
}

// Enable ISR - revalidate every 300 seconds (5 minutes)
export const revalidate = 300;

interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

// ✅ Generate static params (only needs slug/published, safe for build)
export async function generateStaticParams() {
  try {
    const slugs = getAllSlugs(false); // Only published
    return slugs.map(slug => ({ slug }));
  } catch (error) {
    // Return fallback slugs if no content
    return [
      { slug: 'mmust-makes-history' },
      { slug: 'tuk-season-2-champions' },
      { slug: 'new-tournament-format-announced-for-season-3' }
    ];
  }
}

// ✅ Generate metadata (fetch single post by slug — avoids 413 error)
export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  try {
    const { slug } = await params;
    const article = getPostBySlug(slug, false);
    
    if (!article) {
      return {
        title: 'Article | KVE Gaming Blog',
        description: 'Read the latest gaming and esports news from KVE.',
      };
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kve.com';
    const postUrl = `${baseUrl}/blogs/${article.slug}`;
    
    return {
      title: `${article.title} | KVE Gaming Blog`,
      description: article.description || 'Read the latest gaming and esports news from KVE.',
      keywords: [article.category, article.game, 'gaming', 'esports', 'KVE', 'Kenya', ...article.tags]
        .filter(Boolean)
        .join(', '),
      authors: [{ name: article.author || 'KVE Team' }],
      openGraph: {
        title: article.title,
        description: article.description || 'Read the latest gaming and esports news from KVE.',
        url: postUrl,
        siteName: 'KVE',
        images: article.imageUrl ? [{ url: article.imageUrl, width: 1200, height: 630, alt: article.title }] : [],
        locale: 'en_US',
        type: 'article',
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt || article.publishedAt,
        authors: [article.author || 'KVE Team'],
        section: article.category || 'Gaming',
        tags: article.tags,
      },
      twitter: {
        card: 'summary_large_image',
        title: article.title,
        description: article.description || 'Read the latest gaming and esports news from KVE.',
        images: article.imageUrl ? [article.imageUrl] : [],
        creator: '@kve',
        site: '@kve',
      },
      alternates: {
        canonical: postUrl,
      },
    };
  } catch (error) {
    console.error('❌ Error generating metadata:', error);
    return {
      title: 'Article | KVE Gaming Blog',
      description: 'Read the latest gaming and esports news from KVE.',
    };
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const article = getPostBySlug(slug, false);
  
  if (!article) {
    notFound();
  }

  // ✅ JSON-LD (SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description || 'Read the latest gaming and esports news from KVE.',
    image: article.imageUrl ? [article.imageUrl] : [],
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.author || 'KVE Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'KVE',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/blogs/${article.slug}`,
    },
    articleSection: article.category || 'Gaming',
    keywords: [article.category, article.game, ...article.tags].filter(Boolean).join(', '),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="bg-black w-full min-h-screen">
        {/* Navigation */}
        <div className="w-full relative z-20">
          <Navigation />
        </div>

        {/* Blog Post Content */}
        <BlogPostContent post={article} />

        {/* Footer */}
        <FooterSection />
      </main>
    </>
  );
}
