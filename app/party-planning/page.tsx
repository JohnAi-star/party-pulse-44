import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PartyPopper, Users, Calendar, ClipboardList, UtensilsCrossed, LayoutGrid } from 'lucide-react';

export default function PartyPlanningPage() {
  const planningTools = [
    {
      title: 'Guest List Management',
      description: 'Keep track of invitations, RSVPs, and dietary requirements',
      icon: Users,
      href: '/party-planning/guest-list'
    },
    {
      title: 'Timeline Planning',
      description: 'Create and manage your event schedule',
      icon: Calendar,
      href: '/party-planning/timeline'
    },
    {
      title: 'Task Checklist',
      description: 'Stay organized with a comprehensive planning checklist',
      icon: ClipboardList,
      href: '/party-planning/checklist'
    },
    {
      title: 'Menu Planning',
      description: 'Plan your food and drink selections',
      icon: UtensilsCrossed,
      href: '/party-planning/menu'
    },
    {
      title: 'Table Planning',
      description: 'Arrange seating and table layouts',
      icon: LayoutGrid,
      href: '/party-planning/seating'
    }
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Party Planning Tools</h1>
        <p className="text-xl text-muted-foreground">
          Everything you need to plan the perfect celebration
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {planningTools.map((tool) => {
          const Icon = tool.icon;
          return (
            <Link key={tool.title} href={tool.href}>
              <Card className="h-full hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <Icon className="h-8 w-8 text-purple-600 mb-2" />
                  <CardTitle>{tool.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{tool.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}

        {/* Create New Plan Card */}
        <Card className="h-full bg-gradient-to-r from-purple-600 to-pink-600 text-white">
          <CardHeader>
            <PartyPopper className="h-8 w-8 mb-2" />
            <CardTitle>Start Planning</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">Ready to start planning your perfect party?</p>
            <Button variant="secondary" className="w-full">
              Create New Plan
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Tips Section */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold mb-6 text-center">Planning Tips</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Start Early</h3>
              <p className="text-sm text-muted-foreground">
                Begin planning at least 2-3 months in advance for larger events
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Set a Budget</h3>
              <p className="text-sm text-muted-foreground">
                Determine your budget early and track all expenses
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <h3 className="font-semibold mb-2">Delegate Tasks</h3>
              <p className="text-sm text-muted-foreground">
                Don't try to do everything yourself - assign tasks to helpers
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Need Help Section */}
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Need Help Planning?</h2>
        <p className="text-muted-foreground mb-6">
          Our party planning experts are here to help make your event unforgettable
        </p>
        <Link href="/contact">
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600">
            Contact Our Team
          </Button>
        </Link>
      </div>
    </div>
  );
}