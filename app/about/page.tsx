import Image from 'next/image';
import { TEAM_MEMBERS, TESTIMONIALS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">About Party Pulse</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          We're on a mission to help people discover and book unforgettable group experiences
        </p>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
        <div className="relative h-[400px] rounded-lg overflow-hidden">
          <Image
            src="https://images.pexels.com/photos/7551658/pexels-photo-7551658.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
            alt="Group celebrating"
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
          <div className="space-y-4">
            <p className="text-lg">
              Party Pulse was born from a simple idea: making it easy for people to find and book amazing group experiences. Whether you're planning a hen party, team building event, or birthday celebration, we believe that great memories start with the perfect activity.
            </p>
            <p className="text-lg">
              We carefully curate our selection of experiences, working with the best providers across the UK to ensure every booking leads to an unforgettable celebration. Our platform makes it simple to discover, compare, and book activities that bring people together.
            </p>
            <p className="text-lg">
              From cocktail making classes to escape rooms, and from pottery workshops to wine tasting experiences, we're here to help you create moments that matter.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {TEAM_MEMBERS.map((member) => (
            <Card key={member.name} className="text-center">
              <CardContent className="pt-6">
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover rounded-full"
                  />
                </div>
                <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                <p className="text-purple-600 mb-4">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Testimonials Section */}
      <div>
        <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((testimonial) => (
            <Card key={testimonial.name}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="mb-4 text-lg italic">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="relative w-12 h-12 mr-3">
                    <Image
                      src={testimonial.image}
                      alt={testimonial.name}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}