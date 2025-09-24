import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337';
const STRAPI_API_TOKEN = process.env.STRAPI_API_TOKEN;

// Fallback local storage for articles when Strapi is not available
const ARTICLES_FILE = path.join(process.cwd(), 'public', 'articles.json');

function ensureArticlesFile() {
    if (!fs.existsSync(ARTICLES_FILE)) {
        const initialData = {
            articles: [
                {
                    id: '1',
                    title: 'MASINDE MULIRO UNIVERSITY (MMUST) MAKES HISTORY',
                    description: 'As the Only Non-Nairobi Winner in the Kenya University Esports Rankings',
                    content: 'MMUST has made history by becoming the first non-Nairobi university to win the Kenya University Esports Rankings.',
                    slug: 'mmust-makes-history',
                    publishedAt: '2024-01-15T00:00:00.000Z',
                    createdAt: '2024-01-15T00:00:00.000Z',
                    updatedAt: '2024-01-15T00:00:00.000Z',
                    featured: true,
                    category: 'Tournament Results',
                    game: 'PUBG Mobile',
                    author: 'KUER Team',
                    tags: ['MMUST', 'Tournament', 'Victory'],
                    imageUrl: '/images/Join our tournaments.png'
                }
            ],
            nextId: 2
        };
        fs.writeFileSync(ARTICLES_FILE, JSON.stringify(initialData, null, 2));
    }
}

function readArticles() {
    ensureArticlesFile();
    const data = fs.readFileSync(ARTICLES_FILE, 'utf8');
    return JSON.parse(data);
}

// Get articles
export async function GET(request) {
    try {
        // Check if Strapi is running
        let strapiAvailable = false;
        try {
            const healthCheck = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=1`, {
                method: 'GET',
                headers: {
                    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
                },
            });
            
            strapiAvailable = healthCheck.ok || healthCheck.status === 404;
        } catch (healthError) {
            console.log('Strapi not available, using local storage fallback');
            strapiAvailable = false;
        }

        if (strapiAvailable) {
            // Use Strapi if available
            const url = new URL(request.url);
            const searchParams = url.searchParams;
            
            const strapiUrl = new URL(`${STRAPI_URL}/api/articles`);
            
            // Forward query parameters to Strapi
            for (const [key, value] of searchParams.entries()) {
                strapiUrl.searchParams.set(key, value);
            }
            
            const response = await fetch(strapiUrl.toString(), {
                method: 'GET',
                headers: {
                    ...(STRAPI_API_TOKEN && { Authorization: `Bearer ${STRAPI_API_TOKEN}` }),
                },
            });

            if (!response.ok) {
                throw new Error(`Strapi API error: ${response.status}`);
            }

            const data = await response.json();
            return NextResponse.json(data);
        } else {
            // Use local storage fallback
            const articlesData = readArticles();
            
            // Simple pagination and filtering
            const url = new URL(request.url);
            const page = parseInt(url.searchParams.get('pagination[page]') || '1');
            const pageSize = parseInt(url.searchParams.get('pagination[pageSize]') || '10');
            const category = url.searchParams.get('filters[category][$eq]');
            const search = url.searchParams.get('filters[$or][0][title][$containsi]');
            
            let filteredArticles = articlesData.articles;
            
            // Apply category filter
            if (category) {
                filteredArticles = filteredArticles.filter(article => 
                    article.category?.toLowerCase() === category.toLowerCase()
                );
            }
            
            // Apply search filter
            if (search) {
                filteredArticles = filteredArticles.filter(article => 
                    article.title?.toLowerCase().includes(search.toLowerCase()) ||
                    article.description?.toLowerCase().includes(search.toLowerCase())
                );
            }
            
            // Apply pagination
            const startIndex = (page - 1) * pageSize;
            const endIndex = startIndex + pageSize;
            const paginatedArticles = filteredArticles.slice(startIndex, endIndex);
            
            const totalPages = Math.ceil(filteredArticles.length / pageSize);
            
            return NextResponse.json({
                data: paginatedArticles,
                meta: {
                    pagination: {
                        page,
                        pageSize,
                        pageCount: totalPages,
                        total: filteredArticles.length
                    }
                },
                fallback: true
            });
        }
    }
    catch (error) {
        console.error('Error fetching articles:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to fetch articles',
            details: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}