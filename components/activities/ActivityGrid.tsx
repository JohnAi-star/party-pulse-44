import ActivityCard from './ActivityCard';

interface ActivityGridProps {
  activities: {
    id: string;
    title: string;
    description: string;
    city: string;
    priceFrom: number;
    image: string;
    category: string;
    rating: number;
  }[];
}

export default function ActivityGrid({ activities }: ActivityGridProps) {
  return (
    <div>
      {activities.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No activities found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
        </div>
      )}
    </div>
  );
}