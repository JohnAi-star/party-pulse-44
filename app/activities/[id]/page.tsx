import { MOCK_ACTIVITIES } from '@/lib/constants';
import ClientActivityPage from '@/components/activities/ClientActivityPage';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return MOCK_ACTIVITIES.map((activity) => ({
    id: activity.id,
  }));
}

export default function ActivityDetailPage({ params }: { params: { id: string } }) {
  const activity = MOCK_ACTIVITIES.find((a) => a.id === params.id);

  if (!activity) {
    notFound();
  }

  return <ClientActivityPage activity={activity} images={[activity.image]} />;
}