import Link from 'next/link';
import Image from 'next/image';
import { CITIES } from '@/lib/constants';

export default function CitySection() {
  return (
    <section className="bg-slate-50 py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">Explore By Location</h2>
          <p className="text-muted-foreground">Find activities in popular cities across the UK</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
          {CITIES.map((city) => (
            <Link 
              key={city.id} 
              href={`/activities?location=${city.id}`}
              className="group flex flex-col items-center"
            >
              <div className="relative h-32 w-32 rounded-full overflow-hidden mb-3 group-hover:shadow-lg transition-all duration-300">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  loading='lazy'
                />
                <div className="absolute inset-0 bg-black opacity-30 group-hover:opacity-20 transition-opacity" />
              </div>
              <span className="font-medium">{city.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}