import { MOCK_ACTIVITIES } from '@/lib/constants';
import ClientActivityPage from '@/components/activities/ClientActivityPage';
import { notFound } from 'next/navigation';

// Enable both static and dynamic paths
export const dynamicParams = true;

// Pre-render known activity pages at build time
export async function generateStaticParams() {
  return MOCK_ACTIVITIES.map((activity) => ({
    id: activity.id,
  }));
}

// Enable static page generation
export const dynamic = 'force-static';

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = MOCK_ACTIVITIES.find((a) => a.id === params.id);

  if (!activity) {
    return notFound();
  }

  return <ClientActivityPage activity={activity} images={[activity.image]} />;
}