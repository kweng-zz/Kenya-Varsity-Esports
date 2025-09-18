import { notFound, redirect } from 'next/navigation';
import { getGameBySlug, getAllGames } from '@/lib/gamesData';

interface GamePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  // If game doesn't exist, show 404
  if (!game) {
    notFound();
  }

  // Redirect to information page by default
  redirect(`/games/${slug}/information`);

  // In case redirect does not throw in some environments, return null
  return null;
}

// Generate static params for all games (optional, for better performance)
export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}