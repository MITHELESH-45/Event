"use client"

import { useEffect, useState } from "react"
import { API_URL } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileClock, CheckCircle, XCircle, Loader2, Trash2, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"
import { toast } from "sonner"

export default function AdminDashboard() {
    const router = useRouter()
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [analytics, setAnalytics] = useState<any>(null)
    const [deleting, setDeleting] = useState<string | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/auth/login')
                    return
                }

                // Fetch events
                const eventsRes = await fetch('${API_URL}/api/events', {
                    headers: { 'Authorization': `Bearer ${token}` }
                })
                
                // Fetch analytics
                const analyticsRes = await fetch(`${API_URL}/api/admin/analytics`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                })

                if (eventsRes.ok) {
                    const data = await eventsRes.json()
                    setEvents(data)
                }

                if (analyticsRes.ok) {
                    const data = await analyticsRes.json()
                    setAnalytics(data)
                }

            } catch (error) {
                console.error("Failed to fetch data", error)
            } finally {
                setLoading(false)
            }
        }

        fetchData()
    }, [router])

    const handleDelete = async (eventId: string) => {
        if (!confirm("Are you sure you want to delete this event?")) return

        setDeleting(eventId)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`${API_URL}/api/events/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })

            if (res.ok) {
                setEvents(prev => prev.filter(e => e._id !== eventId))
                toast.success("Event deleted successfully")
                
                // Refresh analytics if needed (simple decrement for now)
                if (analytics && analytics.stats) {
                    setAnalytics((prev: any) => ({
                        ...prev,
                        stats: {
                            ...prev.stats,
                            totalEvents: Math.max(0, prev.stats.totalEvents - 1)
                        }
                    }))
                }
            } else {
                toast.error("Failed to delete event")
            }
        } catch (error) {
            console.error("Failed to delete event", error)
            toast.error("Error deleting event")
        } finally {
            setDeleting(null)
        }
    }

    const stats = [
        { title: "Total Events", value: analytics?.stats?.totalEvents?.toString() || "0", icon: Calendar, description: "All events" },
        { title: "Pending Approvals", value: analytics?.stats?.pendingApprovals?.toString() || "0", icon: FileClock, description: "Action needed" },
        { title: "Total Registrations", value: analytics?.stats?.totalRegistrations?.toString() || "0", icon: Users, description: "Total" },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">All Events</h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Title</TableHead>
                                <TableHead>Organizer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center">No events found</TableCell>
                                </TableRow>
                            ) : (
                                events.map((event) => (
                                    <TableRow key={event._id}>
                                        <TableCell className="font-medium">{event.title}</TableCell>
                                        <TableCell>{event.organizer?.name || 'Unknown'}</TableCell>
                                        <TableCell>{event.date ? format(new Date(event.date), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`
                                                ${event.status === 'approved' ? 'bg-green-500/10 text-green-600 border-green-200' : ''}
                                                ${event.status === 'pending' ? 'bg-yellow-500/10 text-yellow-600 border-yellow-200' : ''}
                                                ${event.status === 'rejected' ? 'bg-red-500/10 text-red-600 border-red-200' : ''}
                                            `}>
                                                {event.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild title="View">
                                                    <Link href={`/events/${event._id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="text-destructive hover:text-destructive/90"
                                                    onClick={() => handleDelete(event._id)}
                                                    disabled={deleting === event._id}
                                                >
                                                    {deleting === event._id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}
