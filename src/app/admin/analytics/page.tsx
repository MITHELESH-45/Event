"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, TrendingUp, Award, BarChart3, PieChart, Activity, ArrowUp, ArrowDown } from "lucide-react"

// Mock analytics data
const stats = {
    totalUsers: 2547,
    totalOrganizers: 156,
    totalEvents: 89,
    totalRegistrations: 12458,
    certificatesIssued: 8934,
    activeEvents: 12,
    pendingApprovals: 8,
    monthlyGrowth: 23.5
}

const monthlyData = [
    { month: "Aug", events: 5, registrations: 450 },
    { month: "Sep", events: 8, registrations: 720 },
    { month: "Oct", events: 12, registrations: 1100 },
    { month: "Nov", events: 15, registrations: 1450 },
    { month: "Dec", events: 18, registrations: 1890 },
    { month: "Jan", events: 22, registrations: 2340 }
]

const topEvents = [
    { title: "AI & Machine Learning Summit 2026", registrations: 342, capacity: 500 },
    { title: "Web Development Bootcamp", registrations: 48, capacity: 50 },
    { title: "Cloud Computing Conference", registrations: 156, capacity: 300 },
    { title: "Startup Pitch Competition", registrations: 180, capacity: 200 },
    { title: "Design Thinking Workshop", registrations: 28, capacity: 40 }
]

const categoryDistribution = [
    { category: "Technology", count: 35, percentage: 39 },
    { category: "Business", count: 22, percentage: 25 },
    { category: "Workshop", count: 18, percentage: 20 },
    { category: "Networking", count: 14, percentage: 16 }
]

export default function AdminAnalyticsPage() {
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
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUp className="h-3 w-3 text-primary mr-1" />
                            <span className="text-primary">+12%</span> from last month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription>Total Events</CardDescription>
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalEvents}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUp className="h-3 w-3 text-primary mr-1" />
                            <span className="text-primary">+8</span> new this month
                        </p>
                    </CardContent>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardDescription>Registrations</CardDescription>
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stats.totalRegistrations.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center mt-1">
                            <ArrowUp className="h-3 w-3 text-primary mr-1" />
                            <span className="text-primary">+{stats.monthlyGrowth}%</span> growth
                        </p>
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
                            {((stats.certificatesIssued / stats.totalRegistrations) * 100).toFixed(1)}% completion rate
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
                        <CardDescription>Events and registrations over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {monthlyData.map((data, index) => (
                                <div key={data.month} className="flex items-center gap-4">
                                    <div className="w-12 text-sm text-muted-foreground">{data.month}</div>
                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2 bg-primary rounded-full transition-all"
                                                style={{ width: `${(data.registrations / 2500) * 100}%` }}
                                            />
                                            <span className="text-xs text-muted-foreground">{data.registrations}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="h-2 bg-red-600 rounded-full transition-all"
                                                style={{ width: `${(data.events / 25) * 100}%` }}
                                            />
                                            <span className="text-xs text-muted-foreground">{data.events} events</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-4 mt-4 text-xs">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-primary rounded" />
                                <span>Registrations</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 bg-red-600 rounded" />
                                <span>Events</span>
                            </div>
                        </div>
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
                        <div className="space-y-4">
                            {categoryDistribution.map((cat, index) => {
                                const colors = ["bg-primary", "bg-red-600", "bg-yellow-500", "bg-red-800"]
                                return (
                                    <div key={cat.category} className="space-y-2">
                                        <div className="flex justify-between text-sm">
                                            <span>{cat.category}</span>
                                            <span className="text-muted-foreground">{cat.count} events ({cat.percentage}%)</span>
                                        </div>
                                        <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${colors[index]} rounded-full transition-all`}
                                                style={{ width: `${cat.percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
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
                    <div className="space-y-4">
                        {topEvents.map((event, index) => (
                            <div key={event.title} className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/20 text-primary font-bold">
                                    {index + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="font-medium truncate">{event.title}</div>
                                    <div className="text-sm text-muted-foreground">
                                        {event.registrations}/{event.capacity} registered ({((event.registrations / event.capacity) * 100).toFixed(0)}%)
                                    </div>
                                </div>
                                <div className="w-32">
                                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary rounded-full"
                                            style={{ width: `${(event.registrations / event.capacity) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
