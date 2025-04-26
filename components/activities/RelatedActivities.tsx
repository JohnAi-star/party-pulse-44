import { MOCK_ACTIVITIES } from '@/lib/constants';
import ActivityCard from './ActivityCard';

interface RelatedActivitiesProps {
  currentActivityId: string;
  category: string;
}

export default function RelatedActivities({ currentActivityId, category }: RelatedActivitiesProps) {
  // Filter activities by category and exclude the current one
  const relatedActivities = MOCK_ACTIVITIES.filter(
    activity => activity.category === category && activity.id !== currentActivityId
  ).slice(0, 3); // Limit to 3 related activities
  
  if (relatedActivities.length === 0) {
    // If no related activities in the same category, show other random activities
    const otherActivities = MOCK_ACTIVITIES.filter(
      activity => activity.id !== currentActivityId
    ).slice(0, 3);
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherActivities.map(activity => (
          <ActivityCard key={activity.id} activity={activity} />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {relatedActivities.map(activity => (
        <ActivityCard key={activity.id} activity={activity} />
      ))}
    </div>
  );
}