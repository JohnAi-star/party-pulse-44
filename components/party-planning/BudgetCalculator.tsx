"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Plus, Edit2, Trash2, PoundSterling } from 'lucide-react';
import { Badge } from '../ui/badge';

interface BudgetItem {
  id: string;
  category: string;
  description: string;
  estimated_cost: number;
  actual_cost: number;
  paid: boolean;
}

interface BudgetCalculatorProps {
  partyPlanId: string;
}

export default function BudgetCalculator({ partyPlanId }: BudgetCalculatorProps) {
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [totalBudget, setTotalBudget] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editingItem, setEditingItem] = useState<BudgetItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchBudget();
  }, []);

  const fetchBudget = async () => {
    try {
      const response = await fetch(`/api/party-plans/${partyPlanId}`);
      const data = await response.json();
      setBudgetItems(data.budget_items || []);
      setTotalBudget(data.budget || 0);
    } catch (error) {
      console.error('Error fetching budget:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to fetch budget information",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const itemData = {
      category: formData.get('category') as string,
      description: formData.get('description') as string,
      estimated_cost: parseFloat(formData.get('estimated_cost') as string),
      actual_cost: parseFloat(formData.get('actual_cost') as string) || 0,
      paid: formData.get('paid') === 'true',
    };

    try {
      if (editingItem) {
        const response = await fetch('/api/budget-items', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingItem.id,
            updates: itemData,
          }),
        });

        if (!response.ok) throw new Error('Failed to update budget item');

        toast({
          title: "Success",
          description: "Budget item updated successfully",
        });
      } else {
        const response = await fetch('/api/budget-items', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partyPlanId,
            item: itemData,
          }),
        });

        if (!response.ok) throw new Error('Failed to add budget item');

        toast({
          title: "Success",
          description: "Budget item added successfully",
        });
      }

      fetchBudget();
      setEditingItem(null);
    } catch (error) {
      console.error('Error saving budget item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save budget item",
      });
    }
  };

  const handleDelete = async (itemId: string) => {
    if (!confirm('Are you sure you want to remove this budget item?')) return;

    try {
      const response = await fetch('/api/budget-items', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId }),
      });

      if (!response.ok) throw new Error('Failed to delete budget item');

      toast({
        title: "Success",
        description: "Budget item removed successfully",
      });

      fetchBudget();
    } catch (error) {
      console.error('Error deleting budget item:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove budget item",
      });
    }
  };

  const calculateTotals = () => {
    const estimated = budgetItems.reduce((sum, item) => sum + item.estimated_cost, 0);
    const actual = budgetItems.reduce((sum, item) => sum + item.actual_cost, 0);
    const paid = budgetItems.reduce((sum, item) => sum + (item.paid ? item.actual_cost : 0), 0);
    
    return {
      estimated,
      actual,
      paid,
      remaining: totalBudget - actual,
    };
  };

  if (loading) {
    return <div>Loading budget calculator...</div>;
  }

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium">Budget Calculator</h3>
          <p className="text-sm text-muted-foreground">
            Track your party expenses
          </p>
        </div>

        <Button onClick={() => setEditingItem(null)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Expense
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Budget Overview</CardTitle>
          <CardDescription>
            Total Budget: £{totalBudget.toFixed(2)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span>Spent vs Budget</span>
                <span>
                  £{totals.actual.toFixed(2)} / £{totalBudget.toFixed(2)}
                </span>
              </div>
              <Progress
                value={(totals.actual / totalBudget) * 100}
                className="h-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    £{totals.remaining.toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Remaining Budget
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="text-2xl font-bold">
                    £{totals.paid.toFixed(2)}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Total Paid
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Estimated</TableHead>
                <TableHead>Actual</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {budgetItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.description}</TableCell>
                  <TableCell>£{item.estimated_cost.toFixed(2)}</TableCell>
                  <TableCell>£{item.actual_cost.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={item.paid ? 'default' : 'secondary'}>
                      {item.paid ? 'Paid' : 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditingItem(item)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {budgetItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center">
                    No expenses added yet
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {editingItem && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingItem ? 'Edit Expense' : 'Add New Expense'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Input
                  id="category"
                  name="category"
                  defaultValue={editingItem?.category}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  name="description"
                  defaultValue={editingItem?.description}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="estimated_cost">Estimated Cost (£)</Label>
                  <Input
                    id="estimated_cost"
                    name="estimated_cost"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem?.estimated_cost}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="actual_cost">Actual Cost (£)</Label>
                  <Input
                    id="actual_cost"
                    name="actual_cost"
                    type="number"
                    step="0.01"
                    defaultValue={editingItem?.actual_cost}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Payment Status</Label>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="paid"
                    name="paid"
                    defaultChecked={editingItem?.paid}
                  />
                  <Label htmlFor="paid">Paid</Label>
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingItem ? 'Update Expense' : 'Add Expense'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}