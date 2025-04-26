import Image from 'next/image';
import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/constants';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Party Planning Tips & Ideas</h1>
        <p className="text-xl text-muted-foreground">
          Expert advice and inspiration for your next group celebration
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {BLOG_POSTS.map((post) => (
          <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative h-64">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className="bg-white/90 backdrop-blur-sm text-sm font-medium px-3 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
            </div>
            
            <CardContent className="p-6">
              <div className="flex items-center text-sm text-muted-foreground mb-4">
                <Calendar className="h-4 w-4 mr-1" />
                <span>{format(new Date(post.date), 'MMMM d, yyyy')}</span>
                <span className="mx-2">•</span>
                <Clock className="h-4 w-4 mr-1" />
                <span>{post.readTime}</span>
              </div>
              
              <h2 className="text-2xl font-bold mb-3 line-clamp-2">
                {post.title}
              </h2>
              
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {post.snippet}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <span className="text-sm font-medium">By {post.author}</span>
                </div>
                <Button variant="ghost" className="group">
                  Read More
                  <span className="inline-block transition-transform group-hover:translate-x-1 ml-1">
                    →
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}