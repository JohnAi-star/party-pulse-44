import { Metadata } from 'next';
import { MOCK_ACTIVITIES } from '@/lib/constants';
import ClientActivityPage from '@/components/activities/ClientActivityPage';
import { notFound } from 'next/navigation';

// Enable both static and dynamic paths
export const dynamicParams = true;

// Generate metadata for each activity page
export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const activity = MOCK_ACTIVITIES.find((a) => a.id === params.id);

  if (!activity) {
    return {
      title: 'Activity Not Found | Party Pulse',
      description: 'The requested activity could not be found.',
    };
  }

  return {
    title: `${activity.title} in ${activity.city} | Party Pulse`,
    description: activity.description,
    openGraph: {
      title: `${activity.title} in ${activity.city} | Party Pulse`,
      description: activity.description,
      images: [{ url: activity.image }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${activity.title} in ${activity.city} | Party Pulse`,
      description: activity.description,
      images: [activity.image],
    },
  };
}

// Pre-render known activity pages at build time
export async function generateStaticParams() {
  return MOCK_ACTIVITIES.map((activity) => ({
    id: activity.id,
  }));
}

// Enable static page generation
export const dynamic = 'force-static';

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  // Find the activity and related images
  const activity = MOCK_ACTIVITIES.find((a) => a.id === params.id);

  if (!activity) {
    return notFound();
  }

  // Get similar activities for additional images
  const relatedActivities = MOCK_ACTIVITIES
    .filter(a => a.id !== activity.id && a.category === activity.category)
    .slice(0, 2);

  // Combine main activity image with related activity images
  const images = [activity.image, ...relatedActivities.map(a => a.image)];

  return <ClientActivityPage activity={activity} images={images} />;
}