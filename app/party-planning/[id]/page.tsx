"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import GuestList from '@/components/party-planning/GuestList';
import MenuPlanner from '@/components/party-planning/MenuPlanner';
import TablePlanner from '@/components/party-planning/TablePlanner';
import Checklist from '@/components/party-planning/Checklist';
import BudgetCalculator from '@/components/party-planning/BudgetCalculator';
export default function PartyPlanningPage() {
  const params = useParams();
  const [partyPlan, setPartyPlan] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartyPlan = async () => {
      try {
        const response = await fetch(`/api/party-plans/${params.id}`);
        const data = await response.json();
        setPartyPlan(data);
      } catch (error) {
        console.error('Error fetching party plan:', error);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchPartyPlan();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!partyPlan) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Party Plan Not Found</h1>
        <p className="text-muted-foreground">
          The party plan you're looking for doesn't exist or has been removed.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{partyPlan.title}</h1>
        <p className="text-muted-foreground">
          Plan your perfect celebration with our comprehensive tools
        </p>
      </div>

      <Tabs defaultValue="guests" className="space-y-8">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="guests">Guest List</TabsTrigger>
          <TabsTrigger value="menu">Menu</TabsTrigger>
          <TabsTrigger value="tables">Tables</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>

        <TabsContent value="guests">
          <Card>
            <CardHeader>
              <CardTitle>Guest List Management</CardTitle>
            </CardHeader>
            <CardContent>
              <GuestList partyPlanId={partyPlan.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="menu">
          <Card>
            <CardHeader>
              <CardTitle>Menu Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <MenuPlanner partyPlanId={partyPlan.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tables">
          <Card>
            <CardHeader>
              <CardTitle>Table Planning</CardTitle>
            </CardHeader>
            <CardContent>
              <TablePlanner partyPlanId={partyPlan.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="checklist">
          <Card>
            <CardHeader>
              <CardTitle>Planning Checklist</CardTitle>
            </CardHeader>
            <CardContent>
              <Checklist partyPlanId={partyPlan.id} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="budget">
          <Card>
            <CardHeader>
              <CardTitle>Budget Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetCalculator partyPlanId={partyPlan.id} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}