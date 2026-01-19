import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { contentfulAPI, transformContentfulArticle, TransformedArticle } from '@/lib/contentful';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { BlogPostContent } from '@/components/pages/blogs/BlogPostContent';

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
    // Check if Contentful is available during build
    if (process.env.NEXT_PUBLIC_FALLBACK_MODE === 'true' || !process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID) {
      // Return fallback slugs for build time
      return [
        { slug: 'mmust-makes-history' },
        { slug: 'tuk-season-2-champions' },
        { slug: 'new-tournament-format-announced-for-season-3' }
      ];
    }

    const response = await contentfulAPI.getArticles({ pageSize: 100 });
    const publishedArticles = response.data.filter(article => {
      return article.slug; // Only include articles with valid slugs
    });

    return publishedArticles.map((article) => {
      return {
        slug: article.slug || 'unknown-article',
      };
    });
  } catch (error) {
    // Return fallback slugs if Contentful is not available
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
    
    // Try to fetch from Contentful
    if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID && process.env.NEXT_PUBLIC_FALLBACK_MODE !== 'true') {
      try {
        const response = await contentfulAPI.getArticleBySlug(slug);
        
        if (response.data.length > 0) {
          const article: TransformedArticle = response.data[0];
          const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kve.com';
          const postUrl = `${baseUrl}/blogs/${article.slug}`;
          
          return {
            title: `${String(article.title || 'Article')} | KVE Gaming Blog`,
            description: String(article.description || 'Read the latest gaming and esports news from KVE.'),
            keywords: [String(article.category || ''), String(article.game || ''), 'gaming', 'esports', 'KVE', 'Kenya']
              .filter(Boolean)
              .join(', '),
            authors: [{ name: String(article.author || 'KVE Team') }],
            openGraph: {
              title: String(article.title || 'Article'),
              description: String(article.description || 'Read the latest gaming and esports news from KVE.'),
              url: postUrl,
              siteName: 'KVE',
              images: article.imageUrl ? [{ url: article.imageUrl, width: 1200, height: 630, alt: String(article.title || 'Article') }] : [],
              locale: 'en_US',
              type: 'article',
              publishedTime: String(article.publishedAt || new Date().toISOString()),
              modifiedTime: String(article.updatedAt || article.publishedAt || new Date().toISOString()),
              authors: [String(article.author || 'KVE Team')],
              section: String(article.category || 'Gaming'),
              tags: Array.isArray(article.tags) ? article.tags : [],
            },
            twitter: {
              card: 'summary_large_image',
              title: String(article.title || 'Article'),
              description: String(article.description || 'Read the latest gaming and esports news from KVE.'),
              images: article.imageUrl ? [article.imageUrl] : [],
              creator: '@kve',
              site: '@kve',
            },
            alternates: {
              canonical: postUrl,
            },
          };
        }
      } catch (contentfulError) {
        console.error('❌ Error fetching metadata from Contentful:', contentfulError);
      }
    }

    // Fallback metadata
    return {
      title: 'Article | KVE Gaming Blog',
      description: 'Read the latest gaming and esports news from KVE.',
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
  let article: TransformedArticle | null = null;
  
  try {
    // Try to fetch from Contentful
    if (process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID && process.env.NEXT_PUBLIC_FALLBACK_MODE !== 'true') {
      try {
        const response = await contentfulAPI.getArticleBySlug(slug);
        
        if (response.data.length > 0) {
          article = response.data[0];
        }
      } catch (contentfulError) {
        // Continue to fallback
      }
    }

    // If no article found, use fallback articles
    if (!article) {
      const fallbackArticles = [
        {
          id: '6',
          title: 'Safaricom Game Conference: KVE Showcases the Future of University Esports in Kenya',
          description: 'Kenya University Esports Rankings (KVE) is shaping the future of university gaming in Kenya, giving student gamers a platform to shine and grow.',
          content: 'The Safaricom Game Conference was a landmark event in Kenya\'s gaming industry, bringing together innovators, gamers, and organizations shaping the future of Esports. Among the standout contributors was KVE (Kenya University Esports Rankings), a pioneering organization dedicated to nurturing gaming talent and promoting Esports as a platform for growth, opportunity, and community impact.\n\n**Safaricom\'s Support for the Gaming Ecosystem**\n\nThe event featured remarks by Fawzia Ali Kimanthi, Chief Consumer Business Officer at Safaricom Kenya, who reaffirmed the company\'s commitment to supporting young people through innovation in technology and gaming. She explained how Safaricom aims to be a brand that resonates with gamers by offering solutions that address their needs. Through initiatives such as the Spark Accelerator Program, Safaricom is actively creating opportunities for startups and innovators in Kenya\'s gaming ecosystem.\n\n**KVE: Empowering Gamers Across Kenya**\n\nShirley Adema, CEO and founder of KVE, shared her inspiring journey of how gaming became an integral part of her life. Introduced to gaming at an early age by her five brothers, Shirley grew up facing the challenges of limited opportunities in Esports. Her passion for competitive gaming and her experiences as an athlete pushed her to establish KVE as a platform that creates pathways for Kenyan gamers to thrive.\n\nKVE is built on the vision of transforming gaming into a structured and professional industry in Kenya. From grassroots initiatives to competitive platforms, KVE is focused on ensuring that players—regardless of background—have the chance to showcase their talent, build careers, and become part of a growing global community.\n\n**Creating Structures for the Future**\n\nAt the Safaricom Game Conference, Shirley emphasized the importance of building structures, recognition, and platforms for Esports in Kenya. KVE is dedicated to this mission, working with stakeholders and institutions to create opportunities for players at every level. By addressing the challenges she once faced, Shirley and her team are ensuring that today\'s gamers don\'t just play, but also grow, learn, and benefit from the industry.\n\n**KVE\'s Impact on the Kenyan Esports Scene**\n\nKVE has already begun making a significant impact. Through advocacy, partnerships, and the creation of competitive opportunities, it is laying the foundation for a strong Esports industry in Kenya. The organization continues to champion inclusivity, ensuring that women and underrepresented groups have a place in the Esports conversation.\n\n**Looking Ahead**\n\nThe Safaricom Game Conference demonstrated the power of collaboration in driving Esports forward in Kenya. With Safaricom\'s support for innovation and KVE\'s dedication to empowering gamers, the country is on track to become a leading hub for competitive gaming in Africa.\n\nThe story of KVE is not just about competition—it\'s about transformation, opportunity, and creating a future where Kenyan gamers can thrive locally and globally.',
          slug: 'safaricom-game-conference-kve-showcases-the-future-of-university-esportsinkenya',
          publishedAt: '2025-09-22T18:03:30.570Z',
          createdAt: '2025-09-22T18:03:30.570Z',
          updatedAt: '2025-09-22T18:03:30.570Z',
          featured: true,
          category: 'News',
          game: 'General',
          author: 'Wayne Kabaraji',
          tags: [],
          imageUrl: '/images/Join our tournaments.png',
          image: null
        },
        {
          id: '2',
          title: 'B34R CL4N: Official KVE Sponsor',
          description: 'Who is B34R CL4N?',
          content: 'B34R CL4N isn\'t just a name—it\'s a movement. Built on teamwork dedication and pure love for the game B34R CL4N has grown into a respected force within the Call of Duty: Mobile community. Known for their tactical plays fierce competitive spirit and an unshakable bond the clan embodies what it means to dominate the battlefield while still upholding the values of respect and sportsmanship.\n\nThe battleground is heating up and the competition is fiercer than ever. KUER Call of Duty Tournaments have quickly become one of the most exciting esports events in the region bringing together top talent rising stars and passionate fans of Call of Duty: Mobile. And now we\'re proud to announce a powerful partnership that\'s taking things to the next level.\n\nWhy KUER Tournaments?\n\nSponsoring the KUER Call of Duty Tournaments is more than just a partnership—it\'s a mission. B34R CL4N is committed to growing the local and regional esports scene giving players a platform to showcase their skills and providing fans with unforgettable competitive moments.\n\nBy backing KUER tournaments the clan is not only supporting the next generation of Call of Duty players but also contributing to the overall growth of esports culture.',
          slug: 'b34r-cl4n-official-kve-sponsor',
          publishedAt: '2025-09-19T19:38:52.825Z',
          createdAt: '2025-09-19T19:38:52.809Z',
          updatedAt: '2025-09-19T19:38:52.809Z',
          featured: false,
          category: 'News',
          game: 'General',
          author: 'Tonny Maina',
          tags: [],
          imageUrl: '/images/B34R-CL4N-with-name.png',
          image: null
        },
        {
          id: '1',
          title: 'MASINDE MULIRO UNIVERSITY (MMUST) MAKES HISTORY',
          description: 'As the Only Non-Nairobi Winner in the Kenya Varsity Esports , MMUST has proven that talent exists beyond the capital city.',
          content: 'MMUST has made history by becoming the first non-Nairobi university to win the Kenya Varsity Esports. This achievement showcases the incredible talent that exists beyond the capital city and proves that esports excellence can be found throughout Kenya.\n\nThe team\'s journey to victory was marked by exceptional teamwork, strategic gameplay, and countless hours of practice. Their success serves as an inspiration to universities across the country and demonstrates that with dedication and skill, any team can reach the top.\n\nThis victory not only brings pride to MMUST but also highlights the growing esports scene in Kenya\'s universities. As more institutions invest in esports programs, we can expect to see even more exciting competitions and talented players emerging from across the country.',
          slug: 'mmust-makes-history',
          publishedAt: '2024-01-15T00:00:00.000Z',
          createdAt: '2024-01-15T00:00:00.000Z',
          updatedAt: '2024-01-15T00:00:00.000Z',
          featured: true,
          category: 'Tournament Results',
          game: 'PUBG Mobile',
          author: 'KUER Team',
          tags: ['MMUST', 'Tournament', 'Victory', 'University'],
          imageUrl: '/images/Join our tournaments.png',
          image: null
        },
        {
          id: '3',
          title: 'TUK TAKES THE OVERALL POSITION FOR SEASON 2',
          description: 'The Technical University of Kenya gathers the top position in KVE Season 2, showcasing exceptional gaming skills and teamwork.',
          content: 'The Technical University of Kenya (TUK) has claimed the overall championship position in KVE Season 2, demonstrating exceptional gaming skills and remarkable teamwork throughout the competition.\n\nTUK\'s path to victory was characterized by consistent performance across multiple game titles and strategic gameplay that outmaneuvered their competitors. The team\'s dedication to practice and their ability to adapt to different gaming scenarios proved to be the key factors in their success.\n\nThis championship win solidifies TUK\'s position as one of the premier esports institutions in Kenya and sets a high standard for future competitions. Their victory serves as motivation for other universities to strengthen their esports programs and compete at the highest level.',
          slug: 'tuk-season-2-champions',
          publishedAt: '2024-01-10T00:00:00.000Z',
          createdAt: '2024-01-10T00:00:00.000Z',
          updatedAt: '2024-01-10T00:00:00.000Z',
          featured: false,
          category: 'Championship',
          game: 'Call of Duty Mobile',
          author: 'KUER Team',
          tags: ['TUK', 'Championship', 'Season 2', 'Victory'],
          imageUrl: '/images/Join-Your-Uni.png',
          image: null
        },
        {
          id: '4',
          title: 'SEASON 3 REGISTRATION NOW OPEN',
          description: 'Universities across Kenya can now register for the upcoming Season 3 of the Kenya University Esports Rankings.',
          content: 'The registration for KUER Season 3 is now officially open! Universities across Kenya are invited to participate in what promises to be the most exciting season yet.\n\nSeason 3 will feature expanded game titles, increased prize pools, and enhanced streaming coverage. We\'re expecting record participation as more universities recognize the value of competitive esports.\n\nRegistration is simple and can be completed through our official website. Don\'t miss this opportunity to showcase your university\'s gaming talent and compete for the championship title.',
          slug: 'season-3-registration-open',
          publishedAt: '2024-01-20T00:00:00.000Z',
          createdAt: '2024-01-20T00:00:00.000Z',
          updatedAt: '2024-01-20T00:00:00.000Z',
          featured: false,
          category: 'Registration',
          game: 'Multiple Games',
          author: 'KUER Team',
          tags: ['Registration', 'Season 3', 'Universities', 'Competition'],
          imageUrl: '/images/Join-the-Discord.png',
          image: null
        },
        {
          id: '5',
          title: 'NEW GAMES ADDED TO KUER LINEUP',
          description: 'Exciting new gaming titles have been added to the official KUER tournament lineup for the upcoming season.',
          content: 'We\'re thrilled to announce the addition of several new gaming titles to the KUER tournament lineup! These additions reflect the evolving esports landscape and provide more opportunities for universities to showcase their gaming talents.\n\nThe new games have been carefully selected based on their competitive viability, popularity among university students, and potential for exciting tournament play. Each game brings unique strategic elements and skill requirements to the competition.\n\nWith these additions, KUER continues to evolve and provide the most comprehensive university esports experience in Kenya. Stay tuned for more details about tournament formats and schedules for these new titles.',
          slug: 'new-games-added-kuer-lineup',
          publishedAt: '2024-01-18T00:00:00.000Z',
          createdAt: '2024-01-18T00:00:00.000Z',
          updatedAt: '2024-01-18T00:00:00.000Z',
          featured: false,
          category: 'Updates',
          game: 'Multiple Games',
          author: 'KUER Team',
          tags: ['New Games', 'Tournament', 'Updates', 'Lineup'],
          imageUrl: '/images/footer.png',
          image: null
        }
      ];

      const foundArticle = fallbackArticles.find(a => a.slug === slug);
      if (!foundArticle) {
        notFound();
      }
      article = foundArticle;
    }
  } catch (error) {
    console.error('❌ Error fetching article:', error);
    notFound();
  }

  if (!article) {
    notFound();
  }

  // ✅ JSON-LD (SEO)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: String(article.title || 'Article'),
    description: String(article.description || 'Read the latest gaming and esports news from KUER.'),
    image: article.imageUrl ? [article.imageUrl] : [],
    datePublished: String(article.publishedAt || new Date().toISOString()),
    dateModified: String(article.updatedAt || article.publishedAt || new Date().toISOString()),
    author: {
      '@type': 'Person',
      name: String(article.author || 'KUER Team'),
    },
    publisher: {
      '@type': 'Organization',
      name: 'KUER',
      logo: {
        '@type': 'ImageObject',
        url: `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com'}/blogs/${article.slug}`,
    },
    articleSection: String(article.category || 'Gaming'),
    keywords: [String(article.category || ''), String(article.game || ''), ...(Array.isArray(article.tags) ? article.tags : [])].filter(Boolean).join(', '),
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