import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Magnet as Champagne, Beer, Users, Cake, Briefcase, Snowflake } from 'lucide-react';

// Map of category IDs to their respective icons
const categoryIcons = {
  'champagne': Champagne,
  'beer': Beer,
  'users': Users,
  'cake': Cake,
  'briefcase': Briefcase,
  'snowflake': Snowflake,
};

export default function CategorySection() {
  return (
    <section className="container mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-2">Explore By Category</h2>
        <p className="text-muted-foreground">Find the perfect activity for any occasion</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((category) => {
          const IconComponent = categoryIcons[category.icon as keyof typeof categoryIcons];
          
          return (
            <Link key={category.id} href={`/activities?category=${category.id}`}>
              <Card className="overflow-hidden transition-transform hover:scale-[1.02] hover:shadow-lg">
                <div className="relative h-48">
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover"
                    loading='lazy'
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <div className="flex items-center mb-2">
                      {IconComponent && <IconComponent className="h-5 w-5 mr-2" />}
                      <h3 className="text-xl font-bold">{category.title}</h3>
                    </div>
                    <p className="text-sm text-white/90">{category.description}</p>
                  </div>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
}