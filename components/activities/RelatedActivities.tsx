import { MOCK_ACTIVITIES } from '@/lib/constants';
import ActivityCard from './ActivityCard';

interface RelatedActivitiesProps {
  currentActivityId: string;
  category: string;
  city: string;
}

export default function RelatedActivities({ currentActivityId, category, city }: RelatedActivitiesProps) {
  // First try to find activities in the same category and city
  let relatedActivities = MOCK_ACTIVITIES.filter(
    activity => 
      activity.id !== currentActivityId && 
      activity.category === category &&
      activity.city === city
  );

  // If not enough activities found, include activities from the same category in different cities
  if (relatedActivities.length < 3) {
    const additionalActivities = MOCK_ACTIVITIES.filter(
      activity => 
        activity.id !== currentActivityId && 
        activity.category === category &&
        activity.city !== city
    );
    relatedActivities = [...relatedActivities, ...additionalActivities];
  }

  // If still not enough, include activities from the same city but different categories
  if (relatedActivities.length < 3) {
    const cityActivities = MOCK_ACTIVITIES.filter(
      activity => 
        activity.id !== currentActivityId && 
        activity.city === city &&
        activity.category !== category
    );
    relatedActivities = [...relatedActivities, ...cityActivities];
  }

  // Take only the first 3 activities
  relatedActivities = relatedActivities.slice(0, 3);
  
  if (relatedActivities.length === 0) {
    // If no related activities found, show random activities
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