import Hero from '@/components/home/Hero';
import CategorySection from '@/components/home/CategorySection';
import CitySection from '@/components/home/CitySection';
import FeaturedActivities from '@/components/home/FeaturedActivities';
import CallToAction from '@/components/home/CallToAction';

export default function Home() {
  return (
    <main>
      <Hero />
      <CategorySection />
      <FeaturedActivities />
      <CitySection />
      <CallToAction />
    </main>
  );
}