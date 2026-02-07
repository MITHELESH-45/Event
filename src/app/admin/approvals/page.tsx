"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Search, CheckCircle, XCircle, Eye, Clock, User, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { toast } from "sonner"
import { format } from "date-fns"

export default function AdminApprovalsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [processing, setProcessing] = useState<string | null>(null)
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null)
    const [stats, setStats] = useState<any>(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            // Fetch all events and filter client side for now, or use query param if supported
            // Assuming API returns all events, we filter for pending
            const res = await fetch('http://localhost:5000/api/events', {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            
            // Fetch stats
            const statsRes = await fetch('http://localhost:5000/api/admin/analytics', {
                headers: { 'Authorization': `Bearer ${token}` }
            })

            if (res.ok) {
                const data = await res.json()
                const pending = data.filter((e: any) => e.status === 'pending')
                setEvents(pending)
            }

            if (statsRes.ok) {
                const data = await statsRes.json()
                setStats(data)
            }
        } catch (error) {
            console.error("Failed to fetch data", error)
            toast.error("Failed to load events")
        } finally {
            setLoading(false)
        }
    }

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleUpdateStatus = async (eventId: string, status: 'approved' | 'rejected') => {
        setProcessing(eventId)
        try {
            const token = localStorage.getItem('token')
            const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status })
            })

            if (!res.ok) throw new Error("Failed to update status")

            toast.success(`Event ${status} successfully`)
            setEvents(prev => prev.filter(e => e._id !== eventId))
            setSelectedEvent(null)
            
            // Refresh stats if needed, or just update locally
        } catch (error) {
            console.error(error)
            toast.error("Something went wrong")
        } finally {
            setProcessing(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Event Approvals</h1>
                <p className="text-muted-foreground">Review and approve pending event submissions</p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Pending Review</CardDescription>
                        <CardTitle className="text-3xl text-primary">{events.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Events</CardDescription>
                        <CardTitle className="text-3xl text-primary">{stats?.stats?.totalEvents || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Active Events</CardDescription>
                        <CardTitle className="text-3xl text-primary">{stats?.stats?.activeEvents || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Registrations</CardDescription>
                        <CardTitle className="text-3xl text-primary">{stats?.stats?.totalRegistrations || 0}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Pending Events */}
            <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                            <CardTitle>Pending Events</CardTitle>
                            <CardDescription>Events awaiting your approval</CardDescription>
                        </div>
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search events..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {filteredEvents.length > 0 ? (
                        <div className="space-y-4">
                            {filteredEvents.map(event => (
                                <Card key={event._id} className="bg-background/50 border-border/30">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                            <div className="space-y-2 flex-1">
                                                <div className="flex items-start justify-between">
                                                    <div>
                                                        <h3 className="font-semibold text-lg">{event.title}</h3>
                                                        <p className="text-sm text-muted-foreground">{event.description}</p>
                                                    </div>
                                                    <Badge variant="outline">{event.category}</Badge>
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <User className="h-4 w-4" />
                                                        {event.organizer?.name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {event.date ? format(new Date(event.date), 'PPP') : 'N/A'}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {event.location}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Users className="h-4 w-4" />
                                                        {event.capacity} capacity
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        Submitted {event.createdAt ? format(new Date(event.createdAt), 'PP') : 'N/A'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2 lg:flex-col">
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <Button variant="outline" size="sm" onClick={() => setSelectedEvent(event)}>
                                                            <Eye className="h-4 w-4 mr-1" /> View Details
                                                        </Button>
                                                    </DialogTrigger>
                                                    <DialogContent className="max-w-2xl">
                                                        <DialogHeader>
                                                            <DialogTitle>{event.title}</DialogTitle>
                                                            <DialogDescription>Review event details before approval</DialogDescription>
                                                        </DialogHeader>
                                                        <div className="space-y-4 py-4">
                                                            <div>
                                                                <h4 className="font-medium mb-1">Description</h4>
                                                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-4">
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Organizer</h4>
                                                                    <p className="text-sm text-muted-foreground">{event.organizer?.name}</p>
                                                                    <p className="text-sm text-muted-foreground">{event.organizer?.email}</p>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Date & Time</h4>
                                                                    <p className="text-sm text-muted-foreground">{event.date ? format(new Date(event.date), 'PPP') : 'N/A'} at {event.time}</p>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Location</h4>
                                                                    <p className="text-sm text-muted-foreground">{event.location}</p>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Capacity</h4>
                                                                    <p className="text-sm text-muted-foreground">{event.capacity} participants</p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <DialogFooter>
                                                            <Button
                                                                variant="destructive"
                                                                disabled={processing === event._id}
                                                                onClick={() => handleUpdateStatus(event._id, 'rejected')}
                                                            >
                                                                <XCircle className="h-4 w-4 mr-1" />
                                                                {processing === event._id ? "Processing..." : "Reject"}
                                                            </Button>
                                                            <Button
                                                                className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                                                disabled={processing === event._id}
                                                                onClick={() => handleUpdateStatus(event._id, 'approved')}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                {processing === event._id ? "Processing..." : "Approve"}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                                                    size="sm"
                                                    disabled={processing === event._id}
                                                    onClick={() => handleUpdateStatus(event._id, 'approved')}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    {processing === event._id ? "..." : "Approve"}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={processing === event._id}
                                                    onClick={() => handleUpdateStatus(event._id, 'rejected')}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    {processing === event._id ? "..." : "Reject"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CheckCircle className="h-12 w-12 mx-auto text-primary mb-4" />
                            <h3 className="text-lg font-medium">All caught up!</h3>
                            <p className="text-muted-foreground">No pending events to review</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
