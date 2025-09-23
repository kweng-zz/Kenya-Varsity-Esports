import { notFound } from 'next/navigation';
import { strapiAPI, transformStrapiArticle } from '@/lib/strapi';
import { Navigation } from '@/components/Navigation';
import { FooterSection } from '@/components/Footer';
import { BlogPostContent } from '@/components/pages/blogs/BlogPostContent';
// Enable ISR - revalidate every 300 seconds (5 minutes)
export const revalidate = 300;
// ✅ Generate static params (only needs slug/published, safe for build)
export async function generateStaticParams() {
    try {
        // Check if Strapi is available during build
        if (!process.env.NEXT_PUBLIC_STRAPI_URL) {
            // Return fallback slugs for build time
            return [
                { slug: 'safaricom-game-conference-kuer-showcases-the-future-of-university-esportsinkenya' },
                { slug: 'b34r-cl4n-official-kuer-sponsor' },
                
            ];
        }
        const response = await strapiAPI.getArticles({ pageSize: 100 });
        const publishedArticles = response.data.filter(article => {
            // Handle both flat and nested structures
            const slug = article.slug || article.attributes?.slug;
            return slug; // Only include articles with valid slugs
        });
        return publishedArticles.map((article) => {
            const slug = article.slug || article.attributes?.slug;
            return {
                slug: slug || 'unknown-article',
            };
        });
    }
    catch (error) {
        console.error('❌ Error generating static params:', error);
        // Return fallback slugs if Strapi is not available
        return [
            { slug: 'mmust-makes-history' },
            { slug: 'tuk-season-2-champions' },
            { slug: 'season-3-registration-open' },
            { slug: 'new-games-added-kuer-lineup' }
        ];
    }
}
// ✅ Generate metadata (fetch single post by slug — avoids 413 error)
export async function generateMetadata({ params }) {
    try {
        const { slug } = await params;
        // Try to fetch from Strapi
        if (process.env.NEXT_PUBLIC_STRAPI_URL) {
            try {
                const response = await strapiAPI.getArticleBySlug(slug);
                if (response.data.length > 0) {
                    const article = transformStrapiArticle(response.data[0]);
                    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://kuer.com';
                    const postUrl = `${baseUrl}/blogs/${article.slug}`;
                    return {
                        title: `${String(article.title || 'Article')} | KUER Gaming Blog`,
                        description: String(article.description || 'Read the latest gaming and esports news from KUER.'),
                        keywords: [String(article.category || ''), String(article.game || ''), 'gaming', 'esports', 'KUER', 'Kenya']
                            .filter(Boolean)
                            .join(', '),
                        authors: [{ name: String(article.author || 'KUER Team') }],
                        openGraph: {
                            title: String(article.title || 'Article'),
                            description: String(article.description || 'Read the latest gaming and esports news from KUER.'),
                            url: postUrl,
                            siteName: 'KUER',
                            images: article.imageUrl ? [{ url: article.imageUrl, width: 1200, height: 630, alt: String(article.title || 'Article') }] : [],
                            locale: 'en_US',
                            type: 'article',
                            publishedTime: String(article.publishedAt || new Date().toISOString()),
                            modifiedTime: String(article.updatedAt || article.publishedAt || new Date().toISOString()),
                            authors: [String(article.author || 'KUER Team')],
                            section: String(article.category || 'Gaming'),
                            tags: Array.isArray(article.tags) ? article.tags : [],
                        },
                        twitter: {
                            card: 'summary_large_image',
                            title: String(article.title || 'Article'),
                            description: String(article.description || 'Read the latest gaming and esports news from KUER.'),
                            images: article.imageUrl ? [article.imageUrl] : [],
                            creator: '@kuer',
                            site: '@kuer',
                        },
                        alternates: {
                            canonical: postUrl,
                        },
                    };
                }
            }
            catch (strapiError) {
                console.error('❌ Error fetching metadata from Strapi:', strapiError);
            }
        }
        // Fallback metadata
        return {
            title: 'Article | KUER Gaming Blog',
            description: 'Read the latest gaming and esports news from KUER.',
        };
    }
    catch (error) {
        console.error('❌ Error generating metadata:', error);
        return {
            title: 'Article | KUER Gaming Blog',
            description: 'Read the latest gaming and esports news from KUER.',
        };
    }
}
export default async function BlogPostPage({ params }) {
    const { slug } = await params;
    let article = null;
    try {
        // First try to fetch from Strapi directly (server-side)
        if (process.env.NEXT_PUBLIC_STRAPI_URL) {
            try {
                const response = await strapiAPI.getArticleBySlug(slug);
                if (response.data.length > 0) {
                    article = transformStrapiArticle(response.data[0]);
                }
            }
            catch (strapiError) {
                console.error('❌ Error fetching from Strapi directly:', strapiError);
                // Continue to fallback
            }
        }
        // If no article found, use fallback articles
        if (!article) {
            const fallbackArticles = [
                {
                    id: '6',
                    title: 'Safaricom Game Conference: KUER Showcases the Future of University Esports in Kenya',
                    description: 'Kenya University Esports Rankings (KUER) is shaping the future of university gaming in Kenya, giving student gamers a platform to shine and grow.',
                    content: 'The Safaricom Game Conference marked a historic moment for the growth of Esports in Kenya, bringing together gamers, brands, and industry leaders to discuss how to shape the future of the industry. Safaricom Kenya, represented by Chief Consumer Business Officer Fawzia Ali Kimanthi, shared the company\'s commitment to empowering young people and supporting innovation in gaming.\n\nFawzia highlighted Safaricom\'s support for startups through initiatives such as the Spark Accelerator Program, noting that the company is open to game development in Kenya. She explained that Safaricom Kenya wants to be recognized as a brand associated with gaming by listening to gamers, understanding their needs, and offering solutions that will grow the industry locally.\n\nGamers Speak at the Safaricom Game Conference\n\nThe conference also gave a platform to gamers who are shaping the Esports scene in Kenya. Thee Beast, who grew up in Kibera, shared how gaming saved his life, showing how powerful Esports can be as a source of hope, opportunity, and transformation.\n\nShirley Adema, CEO of Tunza Esports and founder of the Kenya University Esports Rankings (KUER), shared her personal journey of being introduced to gaming at an early age by her five brothers. She spoke about the challenges she faced as an Esports athlete and the level of dedication it takes to reach the professional stage. These experiences inspired her to create KUER, a platform designed to provide the structure and recognition that she and many other gamers lacked.\n\nKUER Leading the Way in University Esports\n\nAt the heart of Shirley\'s message was KUER, which has quickly become the most important platform for University Esports in Kenya. By ranking and spotlighting student gamers, KUER bridges the gap between university sports and professional Esports, offering students visibility, competitive opportunities, and a pathway to growth.\n\nKUER is more than a ranking system. It is a movement to create a sustainable structure for Kenyan Esports, ensuring that university players are recognized for their skills and given the chance to pursue careers in competitive gaming. The platform is helping to transform student passion into professional potential, making universities a breeding ground for the next generation of Esports talent.\n\nA Strong Future for Esports in Kenya\n\nThe Safaricom Game Conference highlighted how collaboration between industry leaders, gamers, and organizations like KUER can unlock the future of Esports. With Safaricom Kenya positioning itself as a brand that supports gaming and with KUER driving the university Esports agenda, the Kenyan gaming scene is entering an exciting new era.\n\nThe stories of Thee Beast and Shirley Adema are proof that Esports in Kenya is not just about competition but about transformation, resilience, and opportunity. Through platforms like KUER and the support of partners like Safaricom Kenya, the future of University Esports in Kenya has never looked brighter.',
                    slug: 'safaricom-game-conference-kuer-showcases-the-future-of-university-esportsinkenya',
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
                    title: 'B34R CL4N: Official KUER Sponsor',
                    description: 'Who is B34R CL4N?',
                    content: 'B34R CL4N isn\'t just a name—it\'s a movement. Built on teamwork dedication and pure love for the game B34R CL4N has grown into a respected force within the Call of Duty: Mobile community. Known for their tactical plays fierce competitive spirit and an unshakable bond the clan embodies what it means to dominate the battlefield while still upholding the values of respect and sportsmanship.\n\nThe battleground is heating up and the competition is fiercer than ever. KUER Call of Duty Tournaments have quickly become one of the most exciting esports events in the region bringing together top talent rising stars and passionate fans of Call of Duty: Mobile. And now we\'re proud to announce a powerful partnership that\'s taking things to the next level.\n\nWhy KUER Tournaments?\n\nSponsoring the KUER Call of Duty Tournaments is more than just a partnership—it\'s a mission. B34R CL4N is committed to growing the local and regional esports scene giving players a platform to showcase their skills and providing fans with unforgettable competitive moments.\n\nBy backing KUER tournaments the clan is not only supporting the next generation of Call of Duty players but also contributing to the overall growth of esports culture.',
                    slug: 'b34r-cl4n-official-kuer-sponsor',
                    publishedAt: '2025-09-19T19:38:52.825Z',
                    createdAt: '2025-09-19T19:38:52.809Z',
                    updatedAt: '2025-09-19T19:38:52.809Z',
                    featured: false,
                    category: 'News',
                    game: null,
                    author: 'Tonny Maina',
                    tags: [],
                    imageUrl: '/images/B34R-CL4N-with-name.png',
                    image: null
                },
                
            ];
            const foundArticle = fallbackArticles.find(a => a.slug === slug);
            if (!foundArticle) {
                notFound();
            }
            article = foundArticle;
        }
    }
    catch (error) {
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
    return (<>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}/>
      <main className="bg-black w-full min-h-screen">
        {/* Navigation */}
        <div className="w-full relative z-20">
          <Navigation />
        </div>

        {/* Blog Post Content */}
        <BlogPostContent post={article}/>

        {/* Footer */}
        <FooterSection />
      </main>
    </>);
}
