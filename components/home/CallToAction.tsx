import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function CallToAction() {
  return (
    <section className="py-20 relative">
      <div 
        className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
        style={{ clipPath: 'polygon(0 15%, 100% 0, 100% 85%, 0 100%)' }}
      >
        <div className="absolute inset-0 opacity-10" style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }} />
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto text-center text-white py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Create Unforgettable Memories?
          </h2>
          <p className="text-lg mb-8 text-white/90">
            Whether you're planning a hen party, stag do, team building event or birthday celebration, we've got the perfect activities for your group.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/activities">
              <Button size="lg" className="bg-white text-purple-600 hover:bg-white/90">
                Explore Activities
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}