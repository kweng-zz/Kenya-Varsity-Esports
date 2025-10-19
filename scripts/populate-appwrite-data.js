#!/usr/bin/env node

import { Client, Databases, ID } from 'node-appwrite';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = new Client();
const databases = new Databases(client);

// Configure client
client
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
    .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DB_ID || 'esports-db';

// Sample data
const sampleData = {
    universities: [
        {
            name: 'TECHNICAL UNIVERSITY OF KENYA',
            slug: 'technical-university-kenya',
            region: 'nairobi',
            logo: '/images/universities/tuk-logo.png',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'UNIVERSITY OF NAIROBI',
            slug: 'university-of-nairobi',
            region: 'nairobi',
            logo: '/images/universities/uon-logo.png',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'KENYATTA UNIVERSITY',
            slug: 'kenyatta-university',
            region: 'nairobi',
            logo: '/images/universities/ku-logo.png',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'STRATHMORE UNIVERSITY',
            slug: 'strathmore-university',
            region: 'nairobi',
            logo: '/images/universities/strathmore-logo.png',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'JOMO KENYATTA UNIVERSITY',
            slug: 'jomo-kenyatta-university',
            region: 'nairobi',
            logo: '/images/universities/jkuat-logo.png',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    regions: [
        {
            name: 'NAIROBI',
            slug: 'nairobi',
            image: '/images/Uganda.png',
            description: 'Nairobi region universities competing in KUER Season 2',
            backgroundImage: '/images/nairobi-bg.jpg',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'CENTRAL KENYA',
            slug: 'central-kenya',
            image: '/images/Uganda.png',
            description: 'Central Kenya region universities - Coming Soon',
            backgroundImage: '/images/central-bg.jpg',
            isActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'WESTERN KENYA',
            slug: 'western-kenya',
            image: '/images/Uganda.png',
            description: 'Western Kenya region universities - Coming Soon',
            backgroundImage: '/images/western-bg.jpg',
            isActive: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    gameCategories: [
        // September Main Categories
        {
            name: 'PUBGM',
            slug: 'pubgm',
            title: 'PUBGM RANKINGS',
            description: 'Current standings for PUBGM tournament',
            image: '/images/PUBGM.jpeg',
            season: 'september',
            category: 'main',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'CALL OF DUTY MOBILE',
            slug: 'codm',
            title: 'CODM RANKINGS',
            description: 'Current standings for CODM tournament',
            image: '/images/CODM-BR.png',
            season: 'september',
            category: 'main',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'EFOOTBALL',
            slug: 'efootball',
            title: 'EFOOTBALL RANKINGS',
            description: 'Current standings for EFOOTBALL tournament',
            image: '/images/Efootball-Mobile.png',
            season: 'september',
            category: 'main',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // September Added Categories
        {
            name: 'CODM-MULTIPLAYER',
            slug: 'codm-mp',
            title: 'CODM-MULTIPLAYER RANKINGS',
            description: 'Current standings for CODM-MULTIPLAYER tournament',
            image: '/images/CODM-MP.png',
            season: 'september',
            category: 'added',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'EAFC-2V2',
            slug: 'eafc-2v2',
            title: 'EAFC-2V2 RANKINGS',
            description: 'Current standings for EAFC-2V2 tournament',
            image: '/images/EAFC--Open.png',
            season: 'september',
            category: 'added',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'EAFC-WOMEN',
            slug: 'eafc-women',
            title: 'EAFC-WOMEN RANKINGS',
            description: 'Current standings for EAFC-Women tournament',
            image: '/images/EAFC-Women.png',
            season: 'september',
            category: 'added',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    rankings: [
        // General Rankings (no gameCategory)
        {
            universityId: 'tuk-001',
            universityName: 'TECHNICAL UNIVERSITY OF KENYA',
            gameCategory: null,
            region: 'nairobi',
            rank: 1,
            placementPoints: 17,
            participationPoints: 842,
            socialMediaPoints: 0,
            bonusPoints: 3,
            totalPoints: 862,
            season: 'september',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            universityId: 'uon-001',
            universityName: 'UNIVERSITY OF NAIROBI',
            gameCategory: null,
            region: 'nairobi',
            rank: 2,
            placementPoints: 15,
            participationPoints: 720,
            socialMediaPoints: 2,
            bonusPoints: 5,
            totalPoints: 742,
            season: 'september',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            universityId: 'ku-001',
            universityName: 'KENYATTA UNIVERSITY',
            gameCategory: null,
            region: 'nairobi',
            rank: 3,
            placementPoints: 12,
            participationPoints: 650,
            socialMediaPoints: 1,
            bonusPoints: 2,
            totalPoints: 665,
            season: 'september',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // PUBGM Rankings
        {
            universityId: 'tuk-001',
            universityName: 'TECHNICAL UNIVERSITY OF KENYA',
            gameCategory: 'pubgm',
            region: 'nairobi',
            rank: 1,
            placementPoints: 25,
            participationPoints: 180,
            socialMediaPoints: 5,
            bonusPoints: 10,
            totalPoints: 220,
            season: 'september',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            universityId: 'uon-001',
            universityName: 'UNIVERSITY OF NAIROBI',
            gameCategory: 'pubgm',
            region: 'nairobi',
            rank: 2,
            placementPoints: 20,
            participationPoints: 160,
            socialMediaPoints: 3,
            bonusPoints: 7,
            totalPoints: 190,
            season: 'september',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            universityId: 'ku-001',
            universityName: 'KENYATTA UNIVERSITY',
            gameCategory: 'pubgm',
            region: 'nairobi',
            rank: 3,
            placementPoints: 18,
            participationPoints: 140,
            socialMediaPoints: 2,
            bonusPoints: 5,
            totalPoints: 165,
            season: 'september',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // CODM Rankings
        {
            universityId: 'tuk-001',
            universityName: 'TECHNICAL UNIVERSITY OF KENYA',
            gameCategory: 'codm',
            region: 'nairobi',
            rank: 1,
            placementPoints: 30,
            participationPoints: 200,
            socialMediaPoints: 8,
            bonusPoints: 12,
            totalPoints: 250,
            season: 'september',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            universityId: 'strathmore-001',
            universityName: 'STRATHMORE UNIVERSITY',
            gameCategory: 'codm',
            region: 'nairobi',
            rank: 2,
            placementPoints: 25,
            participationPoints: 180,
            socialMediaPoints: 6,
            bonusPoints: 9,
            totalPoints: 220,
            season: 'september',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            universityId: 'uon-001',
            universityName: 'UNIVERSITY OF NAIROBI',
            gameCategory: 'codm',
            region: 'nairobi',
            rank: 3,
            placementPoints: 22,
            participationPoints: 160,
            socialMediaPoints: 4,
            bonusPoints: 6,
            totalPoints: 192,
            season: 'september',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ],
    sponsors: [
        {
            name: 'KUER Official',
            logo: '/images/KUER transparent.png',
            website: 'https://kuer.co.ke',
            description: 'Kenya University Esports Rankings - Official organizer',
            tier: 'platinum',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            name: 'B34R CL4N',
            logo: '/images/B34R-CL4N-with-name.png',
            website: 'https://b34rcl4n.com',
            description: 'Gaming community and esports organization',
            tier: 'gold',
            isActive: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ]
};

async function populateData() {
    try {
        console.log('🚀 Populating Appwrite database with sample data...');

        // Populate Universities
        console.log('👥 Adding universities...');
        for (const university of sampleData.universities) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    'universities',
                    ID.unique(),
                    university
                );
                console.log(`  ✅ Added university: ${university.name}`);
            } catch (error) {
                console.log(`  ⚠️ University ${university.name} may already exist: ${error.message}`);
            }
        }

        // Populate Regions
        console.log('🌍 Adding regions...');
        for (const region of sampleData.regions) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    'regions',
                    ID.unique(),
                    region
                );
                console.log(`  ✅ Added region: ${region.name}`);
            } catch (error) {
                console.log(`  ⚠️ Region ${region.name} may already exist: ${error.message}`);
            }
        }

        // Populate Game Categories
        console.log('🎮 Adding game categories...');
        for (const category of sampleData.gameCategories) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    'game-categories',
                    ID.unique(),
                    category
                );
                console.log(`  ✅ Added game category: ${category.name}`);
            } catch (error) {
                console.log(`  ⚠️ Game category ${category.name} may already exist: ${error.message}`);
            }
        }

        // Populate Rankings
        console.log('🏆 Adding rankings...');
        for (const ranking of sampleData.rankings) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    'rankings',
                    ID.unique(),
                    ranking
                );
                const categoryText = ranking.gameCategory || 'General';
                console.log(`  ✅ Added ranking: ${ranking.universityName} - ${categoryText}`);
            } catch (error) {
                console.log(`  ⚠️ Ranking may already exist: ${error.message}`);
            }
        }

        // Populate Sponsors
        console.log('🤝 Adding sponsors...');
        for (const sponsor of sampleData.sponsors) {
            try {
                await databases.createDocument(
                    DATABASE_ID,
                    'sponsors',
                    ID.unique(),
                    sponsor
                );
                console.log(`  ✅ Added sponsor: ${sponsor.name}`);
            } catch (error) {
                console.log(`  ⚠️ Sponsor ${sponsor.name} may already exist: ${error.message}`);
            }
        }

        console.log('🎉 Data population completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`- Universities: ${sampleData.universities.length}`);
        console.log(`- Regions: ${sampleData.regions.length}`);
        console.log(`- Game Categories: ${sampleData.gameCategories.length}`);
        console.log(`- Rankings: ${sampleData.rankings.length}`);
        console.log(`- Sponsors: ${sampleData.sponsors.length}`);
        console.log('\n✨ Your Appwrite database is now ready to use!');

    } catch (error) {
        console.error('❌ Data population failed:', error);
        process.exit(1);
    }
}

// Run the population
populateData();