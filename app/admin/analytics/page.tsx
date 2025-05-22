"use client"
import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF']

type Activity = {
  id: string
  title: string
  price: number
  rating: number | null
  category: string
  date: string
  image?: string
}

type AnalyticsData = {
  summary: {
    totalActivities: number
    totalRevenue: number
    averageRating: number
    total_price: number
  }
  categories: Record<string, number>
  recentActivities: Activity[]
  revenueTrend: { date: string; revenue: number }[]
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'categories' | 'revenue'>('categories')
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/analytics')
      const result = await res.json()

      if (!res.ok || !result.success) throw new Error(result.error)

      // Transform data for better display
      const transformedData = {
        ...result.data,
        categories: processCategories(result.data.categories),
        recentActivities: result.data.recentActivities.map((a: { date: string | number | Date; category: any }) => ({
          ...a,
          date: new Date(a.date).toLocaleDateString('en-GB'),
          category: a.category || 'Uncategorized'
        })),
        summary: {
          ...result.data.summary,
          averageRating: result.data.summary.averageRating || 0
        }
      }

      setData(transformedData)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load data"
      })
    } finally {
      setLoading(false)
    }
  }

  const processCategories = (categories: Record<string, number>) => {
    const filtered = Object.entries(categories)
      .filter(([name]) => name !== 'Uncategorized' && name !== '')
      .sort((a, b) => b[1] - a[1])

    return filtered.length > 0
      ? Object.fromEntries(filtered)
      : { 'Uncategorized': categories['Uncategorized'] || 0 }
  }

  useEffect(() => { fetchData() }, [])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  };
  if (!data) return <NoDataView onRefresh={fetchData} />

  const formattedCategories = Object.entries(data.categories).map(([name, count]) => ({
    name,
    count,
    percentage: Math.round((count / data.summary.totalActivities) * 100)
  }))

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'categories' ? 'default' : 'outline'}
            onClick={() => setViewMode('categories')}
            size="sm"
          >
            Categories
          </Button>
          <Button
            variant={viewMode === 'revenue' ? 'default' : 'outline'}
            onClick={() => setViewMode('revenue')}
            size="sm"
          >
            Revenue
          </Button>
          <Button onClick={fetchData} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Activities"
          value={data.summary.totalActivities}
          icon="🎉"
        />
        <StatCard
          title="Total Revenue Will made"
          value={`£${data.summary.totalRevenue.toFixed(2)}`}
          icon="💰"
        />
        <StatCard
          title="Bookings"
          value={data.summary.total_price}
          icon="📅"
        />
        <StatCard
          title="Avg Rating"
          value={data.summary.averageRating > 0
            ? `${data.summary.averageRating.toFixed(1)}/5`
            : 'N/A'}
          icon="⭐"
        />
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewMode === 'categories'
              ? 'Activities by Category'
              : 'Revenue Trend (Last 30 Days)'}
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {viewMode === 'categories' ? (
            formattedCategories.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={formattedCategories}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    label={({ name, percentage }) => `${name} (${percentage}%)`}
                  >
                    {formattedCategories.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} activities`,
                      props.payload.name
                    ]}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <NoDataMessage />
            )
          ) : data.revenueTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.revenueTrend}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value) => [`£${value}`, 'Revenue']}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Bar
                  dataKey="revenue"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <NoDataMessage />
          )}
        </CardContent>
      </Card>

      {/* Recent Activities */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.recentActivities.map(activity => (
              <ActivityCard key={activity.id} activity={activity} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ActivityCard({ activity }: { activity: Activity }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex flex-col h-full">
          {activity.image && (
            <div className="relative aspect-video mb-3 rounded-md overflow-hidden">
              <img
                src={activity.image}
                alt={activity.title}
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <h3 className="font-medium text-lg">{activity.title}</h3>
          <div className="flex items-center mt-1 mb-2">
            <span className="text-sm text-muted-foreground capitalize">
              {activity.category.toLowerCase()}
            </span>
          </div>
          <div className="mt-auto flex justify-between items-end">
            <div>
              <p className="font-bold text-primary">£{activity.price.toFixed(2)}</p>
              <p className="text-xs text-muted-foreground">{activity.date}</p>
            </div>
            {activity.rating && (
              <div className="flex items-center">
                <span className="text-yellow-500 text-sm mr-1">
                  {activity.rating.toFixed(1)}
                </span>
                <span className="text-yellow-400">★</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto p-4 space-y-8">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[400px] w-full" />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-[200px] w-full rounded-md" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function NoDataView({ onRefresh }: { onRefresh: () => void }) {
  return (
    <div className="container mx-auto p-4 text-center space-y-4">
      <h2 className="text-xl font-medium">No analytics data available</h2>
      <Button onClick={onRefresh}>
        <RefreshCw className="mr-2 h-4 w-4" /> Check again
      </Button>
    </div>
  )
}

function NoDataMessage() {
  return (
    <div className="h-full flex flex-col items-center justify-center text-gray-500">
      <p>No data available</p>
      <p className="text-sm">Try adjusting your filters or check back later</p>
    </div>
  )
}

function StatCard({
  title,
  value,
  icon
}: {
  title: string;
  value: string | number;
  icon?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {icon && <span>{icon}</span>}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}