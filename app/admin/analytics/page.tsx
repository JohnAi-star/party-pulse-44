"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { RefreshCw } from 'lucide-react'

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A28DFF']

type AnalyticsData = {
  revenue: Array<{ date: string; revenue: number }>
  categories: Array<{ category: string; count: number }>
  stats: Array<{ id: string; title: string; views_count: number }>
  recentBookings: Array<{
    id: string
    created_at: string
    amount: number
    activity: { title: string; category: string }
    user: { name: string }
  }>
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/admin/analytics')
      const result = await response.json()
      
      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to fetch data')
      }

      setData(result.data)
      
      if (result.message) {
        toast({
          title: 'Info',
          description: result.message,
          variant: 'default'
        })
      }
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'An unknown error occurred')
      toast({
        variant: 'destructive',
        title: 'Error',
        description: err instanceof Error ? err.message : 'Failed to load analytics data'
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="container mx-auto p-4 space-y-8">
        <Skeleton className="h-8 w-64" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-[300px] w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 space-y-4">
        <div className="text-red-500">{error}</div>
        <Button onClick={fetchData} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Retry
        </Button>
      </div>
    )
  }

  const hasData = data && (
    data.revenue.length > 0 ||
    data.categories.length > 0 ||
    data.stats.length > 0 ||
    data.recentBookings.length > 0
  )

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
        <Button onClick={fetchData} variant="outline" size="sm" className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </div>

      {!hasData ? (
        <div className="text-center py-12 space-y-4">
          <h2 className="text-xl font-medium">No analytics data available</h2>
          <p className="text-muted-foreground">
            Bookings and activities data will appear here once available
          </p>
          <Button onClick={fetchData} className="gap-2 mt-4">
            <RefreshCw className="h-4 w-4" />
            Check again
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Revenue Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Revenue (Last 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {data.revenue.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={data.revenue}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => [`£${value}`, 'Revenue']} />
                        <Legend />
                        <Bar dataKey="revenue" fill="#8884d8" name="Revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No revenue data
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Categories Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Bookings by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  {data.categories.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.categories}
                          dataKey="count"
                          nameKey="category"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          label={({ category, percent }) => 
                            `${category}: ${(percent * 100).toFixed(0)}%`
                          }
                        >
                          {data.categories.map((_, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={COLORS[index % COLORS.length]} 
                            />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => [`${value} bookings`, 'Count']} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                      No category data
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Popular Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {data.stats.length > 0 ? (
                    data.stats.map((activity) => (
                      <div 
                        key={activity.id} 
                        className="flex justify-between items-center"
                      >
                        <span className="font-medium truncate max-w-[180px]">
                          {activity.title}
                        </span>
                        <span className="text-primary font-medium">
                          {activity.views_count.toLocaleString()} views
                        </span>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500">No activity data</div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Bookings */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Bookings</CardTitle>
            </CardHeader>
            <CardContent>
              {data.recentBookings.length > 0 ? (
                <div className="space-y-4">
                  {data.recentBookings.map((booking) => (
                    <div 
                      key={booking.id} 
                      className="flex justify-between items-center border-b pb-4 last:border-0"
                    >
                      <div className="space-y-1">
                        <p className="font-medium">{booking.activity.title}</p>
                        <p className="text-sm text-muted-foreground">
                          Booked by {booking.user.name}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">£{booking.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(booking.created_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500">No recent bookings</div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}