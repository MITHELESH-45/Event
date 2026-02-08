"use client"

import { useState, useEffect } from "react"
import { API_URL } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp, Award, BarChart3, PieChart, Activity, ArrowUp, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function AdminAnalyticsPage() {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) return

                const res = await fetch(`${API_URL}/api/admin/analytics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (res.ok) {
                    const result = await res.json()
                    setData(result)
                } else {
                    toast.error("Failed to fetch analytics")
                }
            } catch (error) {
                console.error("Failed to fetch analytics", error)
                toast.error("Failed to load analytics")
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    const stats = data?.stats || {
        totalUsers: 0,
        totalOrganizers: 0,
        totalEvents: 0,
        totalRegistrations: 0,
        certificatesIssued: 0,
        activeEvents: 0,
        pendingApprovals: 0
    }

    const monthlyData = data?.monthlyEvents || []
    const topEvents = data?.topEvents || []
    const categoryDistribution = data?.categoryDistribution || []

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                <p className="text-muted-foreground">Platform overview and insights</p>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription>Total Users</CardDescription>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription>Total Events</CardDescription>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEvents}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription>Registrations</CardDescription>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRegistrations.toLocaleString()}</div>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription>Certificates</CardDescription>
                        <Award className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.certificatesIssued.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            {stats.totalRegistrations > 0 
                                ? ((stats.certificatesIssued / stats.totalRegistrations) * 100).toFixed(1) 
                                : 0}% completion rate
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Charts Row */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Monthly Trend */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <BarChart3 className="h-5 w-5" />
                            Monthly Trends
                        </CardTitle>
                        <CardDescription>Events over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {monthlyData.length > 0 ? (
                            <div className="space-y-4">
                                {monthlyData.map((data: any) => (
                                    <div key={data._id} className="flex items-center gap-4">
                                        <div className="w-12 text-sm text-muted-foreground">Month {data._id}</div>
                                        <div className="flex-1 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="h-2 bg-red-600 rounded-full transition-all"
                                                    style={{ width: `${(data.count / 20) * 100}%` }}
                                                />
                                                <span className="text-xs text-muted-foreground">{data.count} events</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No data available</div>
                        )}
                    </CardContent>
                </Card>

                {/* Category Distribution */}
                <Card className="bg-card/50 border-border/50">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <PieChart className="h-5 w-5" />
                            Event Categories
                        </CardTitle>
                        <CardDescription>Distribution by category</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {categoryDistribution.length > 0 ? (
                            <div className="space-y-4">
                                {categoryDistribution.map((cat: any, index: number) => {
                                    const colors = ["bg-primary", "bg-red-600", "bg-yellow-500", "bg-red-800", "bg-blue-500"]
                                    // Calculate percentage if not provided by backend or just show count
                                    // Assuming backend provides count, let's just show relative bar
                                    const percentage = (cat.count / stats.totalEvents) * 100
                                    
                                    return (
                                        <div key={cat._id} className="space-y-2">
                                            <div className="flex justify-between text-sm">
                                                <span>{cat._id}</span>
                                                <span className="text-muted-foreground">{cat.count} events ({percentage.toFixed(0)}%)</span>
                                            </div>
                                            <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full ${colors[index % colors.length]} rounded-full transition-all`}
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-muted-foreground">No data available</div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Top Events */}
            <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Activity className="h-5 w-5" />
                        Top Performing Events
                    </CardTitle>
                    <CardDescription>Events with highest registrations</CardDescription>
                </CardHeader>
                <CardContent>
                    {topEvents.length > 0 ? (
                        <div className="space-y-4">
                            {topEvents.map((event: any, index: number) => (
                                <div key={event._id} className="flex items-center gap-4">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                                        {index + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-medium truncate">{event.title}</div>
                                        <div className="text-sm text-muted-foreground">
                                            {event.registered}/{event.capacity} registered ({event.capacity > 0 ? ((event.registered / event.capacity) * 100).toFixed(0) : 0}%)
                                        </div>
                                    </div>
                                    <div className="w-32">
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-primary rounded-full"
                                                style={{ width: `${event.capacity > 0 ? (event.registered / event.capacity) * 100 : 0}%` }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">No data available</div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-3">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Active Events</CardDescription>
                        <CardTitle className="text-3xl text-primary">{stats.activeEvents}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Currently running events</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Pending Approvals</CardDescription>
                        <CardTitle className="text-3xl text-primary">{stats.pendingApprovals}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Events awaiting review</p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Organizers</CardDescription>
                        <CardTitle className="text-3xl text-primary">{stats.totalOrganizers}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">Registered organizers</p>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
