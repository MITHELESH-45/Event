"use client"

import { useState, useEffect } from "react"
import { API_URL } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Users, Search, Plus, Settings, Eye, BarChart3, CheckCircle, Clock, XCircle, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface Event {
    _id: string
    title: string
    date: string
    time: string
    location: string
    capacity: number
    status: string
    category: string
    registrations?: any[]
}

export default function MyEventsPage() {
    const router = useRouter()
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/auth/login?role=organizer')
                    return
                }

                const res = await fetch(`${API_URL}/api/events/my-events`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()
                    setEvents(data)
                } else {
                    console.error("Failed to fetch events")
                }
            } catch (error) {
                console.error("Error fetching events:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [router])

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "ALL" || event.status.toUpperCase() === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        const upperStatus = status.toUpperCase()
        switch (upperStatus) {
            case "APPROVED":
                return <Badge className="bg-primary/20 text-primary border-primary/30">Approved</Badge>
            case "PENDING":
                return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending</Badge>
            case "COMPLETED":
                return <Badge className="bg-primary/20 text-primary border-primary/30">Completed</Badge>
            case "REJECTED":
                return <Badge variant="destructive">Rejected</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const stats = {
        total: events.length,
        approved: events.filter(e => e.status.toUpperCase() === "APPROVED").length,
        pending: events.filter(e => e.status.toUpperCase() === "PENDING").length,
        completed: events.filter(e => e.status.toUpperCase() === "COMPLETED").length,
        totalRegistrations: events.reduce((sum, e) => sum + (e.registrations?.length || 0), 0),
        totalAttended: 0 // This would need to be calculated from registration attendance data
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">My Events</h1>
                    <p className="text-muted-foreground">Manage your organized events</p>
                </div>
                <Button asChild>
                    <Link href="/organizer/events/create">
                        <Plus className="h-4 w-4 mr-2" /> Create Event
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Events</CardDescription>
                        <CardTitle className="text-2xl text-primary">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Approved</CardDescription>
                        <CardTitle className="text-2xl text-primary">{stats.approved}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Pending</CardDescription>
                        <CardTitle className="text-2xl text-yellow-500">{stats.pending}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Registrations</CardDescription>
                        <CardTitle className="text-2xl text-primary">{stats.totalRegistrations}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Attended</CardDescription>
                        <CardTitle className="text-2xl text-primary">{stats.totalAttended}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Search and Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search events..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {["ALL", "APPROVED", "PENDING", "COMPLETED"].map(status => (
                        <Button
                            key={status}
                            variant={statusFilter === status ? "default" : "outline"}
                            size="sm"
                            onClick={() => setStatusFilter(status)}
                        >
                            {status === "ALL" ? "All" : status.charAt(0) + status.slice(1).toLowerCase()}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Events Table */}
            <Card className="bg-card/50 border-border/50">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Registrations</TableHead>
                                <TableHead className="text-center">Attended</TableHead>
                                <TableHead className="text-center">Certificates</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredEvents.map(event => (
                                <TableRow key={event._id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{event.title}</div>
                                            <div className="text-sm text-muted-foreground">{event.location}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>{event.date ? format(new Date(event.date), 'yyyy-MM-dd') : 'N/A'}</div>
                                            <div className="text-muted-foreground">{event.time}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-medium">{event.registrations?.length || 0}</span>
                                        <span className="text-muted-foreground">/{event.capacity}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {event.status.toUpperCase() === "COMPLETED" ? (
                                            <span className="font-medium text-primary">-</span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        <span className="text-muted-foreground">-</span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/organizer/events/${event._id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/organizer/events/${event._id}/manage`}>
                                                    <Settings className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No events found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search or create a new event</p>
                    <Button asChild>
                        <Link href="/organizer/events/create">
                            <Plus className="h-4 w-4 mr-2" /> Create Event
                        </Link>
                    </Button>
                </div>
            )}
        </div>
    )
}
