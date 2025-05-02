// app/activities/[id]/page.tsx
import { MOCK_ACTIVITIES } from '@/lib/constants';
import ClientActivityPage from '@/components/activities/ClientActivityPage';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

// Enable dynamic rendering for all paths
export const dynamic = 'force-dynamic';

// Add revalidation to cache the page for 60 seconds
export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const activity = MOCK_ACTIVITIES.find((a) => a.id === params.id);

  if (!activity) {
    return {
      title: 'Activity Not Found - Party Pulse',
      description: 'The requested activity could not be found.',
    };
  }

  return {
    title: `${activity.title} - Party Pulse`,
    description: activity.description,
    openGraph: {
      title: `${activity.title} - Party Pulse`,
      description: activity.description,
      images: [activity.image],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${activity.title} - Party Pulse`,
      description: activity.description,
      images: [activity.image],
    },
  };
}

export default async function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = MOCK_ACTIVITIES.find((a) => a.id === params.id);

  if (!activity) {
    return notFound();
  }

  // Get similar activities for the related activities section
  const relatedActivities = MOCK_ACTIVITIES
    .filter(a => a.id !== activity.id && a.category === activity.category)
    .slice(0, 3)
    .map(a => a.image);

  // Combine the main activity image with related activity images
  const allImages = [activity.image, ...relatedActivities];

  return <ClientActivityPage activity={activity} images={allImages} />;
}