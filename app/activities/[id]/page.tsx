// app/activities/[id]/page.tsx
import { MOCK_ACTIVITIES } from '@/lib/constants';
import ClientActivityPage from '@/components/activities/ClientActivityPage';
import { notFound } from 'next/navigation';
import { Metadata, ResolvingMetadata } from 'next';

// This ensures the page is always fresh
export const dynamic = 'force-dynamic';
export const revalidate = 0;

type Props = {
  params: { id: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  try {
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
        images: [{ url: activity.image }],
      },
      twitter: {
        card: 'summary_large_image',
        title: `${activity.title} - Party Pulse`,
        description: activity.description,
        images: [activity.image],
      },
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Activity - Party Pulse',
      description: 'Discover amazing group activities',
    };
  }
}

export default async function ActivityDetailPage({ params }: Props) {
  try {
    // Validate params
    if (!params.id) {
      return notFound();
    }

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
  } catch (error) {
    console.error('Error in ActivityDetailPage:', error);
    throw new Error('Failed to load activity');
  }
}

// Generate static paths for all activities
export async function generateStaticParams() {
  return MOCK_ACTIVITIES.map((activity) => ({
    id: activity.id,
  }));
}