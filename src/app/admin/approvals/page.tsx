"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Search, CheckCircle, XCircle, Eye, Clock, User } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

// Mock pending events data
const mockPendingEvents = [
    {
        id: "1",
        title: "Blockchain Technology Summit",
        description: "Explore the future of blockchain and decentralized technologies with industry leaders.",
        organizer: "Tech Innovators Inc.",
        organizerEmail: "events@techinnovators.com",
        date: "2026-03-15",
        time: "09:00 AM",
        location: "Crypto Arena",
        capacity: 400,
        category: "Technology",
        submittedAt: "2026-01-28",
        status: "PENDING"
    },
    {
        id: "2",
        title: "Digital Marketing Masterclass",
        description: "Advanced strategies for digital marketing success in 2026.",
        organizer: "MarketPro Academy",
        organizerEmail: "contact@marketpro.com",
        date: "2026-03-20",
        time: "10:00 AM",
        location: "Business Hub",
        capacity: 150,
        category: "Business",
        submittedAt: "2026-01-29",
        status: "PENDING"
    },
    {
        id: "3",
        title: "Data Science Workshop",
        description: "Hands-on workshop on machine learning and data analytics.",
        organizer: "DataLabs",
        organizerEmail: "workshops@datalabs.io",
        date: "2026-03-25",
        time: "09:30 AM",
        location: "Tech Campus",
        capacity: 60,
        category: "Workshop",
        submittedAt: "2026-01-30",
        status: "PENDING"
    },
    {
        id: "4",
        title: "Sustainable Business Forum",
        description: "Discussions on sustainable business practices and green initiatives.",
        organizer: "Green Future Foundation",
        organizerEmail: "events@greenfuture.org",
        date: "2026-04-01",
        time: "11:00 AM",
        location: "Eco Center",
        capacity: 200,
        category: "Business",
        submittedAt: "2026-01-31",
        status: "PENDING"
    },
    {
        id: "5",
        title: "Mobile App Development Bootcamp",
        description: "Intensive 2-day bootcamp on React Native and Flutter.",
        organizer: "CodeCraft Academy",
        organizerEmail: "info@codecraft.dev",
        date: "2026-04-05",
        time: "09:00 AM",
        location: "Developer Hub",
        capacity: 40,
        category: "Workshop",
        submittedAt: "2026-02-01",
        status: "PENDING"
    }
]

const recentlyProcessed = [
    { id: "a1", title: "AI Innovation Conference", status: "APPROVED", processedAt: "2026-01-27" },
    { id: "a2", title: "Startup Networking Event", status: "APPROVED", processedAt: "2026-01-26" },
    { id: "a3", title: "Cryptocurrency Trading Workshop", status: "REJECTED", processedAt: "2026-01-25", reason: "Incomplete documentation" },
    { id: "a4", title: "Cloud Security Summit", status: "APPROVED", processedAt: "2026-01-24" }
]

export default function AdminApprovalsPage() {
    const [events, setEvents] = useState(mockPendingEvents)
    const [searchTerm, setSearchTerm] = useState("")
    const [processing, setProcessing] = useState<string | null>(null)
    const [selectedEvent, setSelectedEvent] = useState<typeof mockPendingEvents[0] | null>(null)

    const filteredEvents = events.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleApprove = async (eventId: string) => {
        setProcessing(eventId)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setEvents(prev => prev.filter(e => e.id !== eventId))
        setProcessing(null)
        setSelectedEvent(null)
    }

    const handleReject = async (eventId: string) => {
        setProcessing(eventId)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setEvents(prev => prev.filter(e => e.id !== eventId))
        setProcessing(null)
        setSelectedEvent(null)
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
                        <CardTitle className="text-3xl text-yellow-400">{events.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Approved (This Week)</CardDescription>
                        <CardTitle className="text-3xl text-green-400">12</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Rejected (This Week)</CardDescription>
                        <CardTitle className="text-3xl text-red-400">2</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Avg. Review Time</CardDescription>
                        <CardTitle className="text-3xl text-blue-400">1.5d</CardTitle>
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
                                <Card key={event.id} className="bg-background/50 border-border/30">
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
                                                        {event.organizer}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(event.date).toLocaleDateString()}
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
                                                        Submitted {new Date(event.submittedAt).toLocaleDateString()}
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
                                                                    <p className="text-sm text-muted-foreground">{event.organizer}</p>
                                                                    <p className="text-sm text-muted-foreground">{event.organizerEmail}</p>
                                                                </div>
                                                                <div>
                                                                    <h4 className="font-medium mb-1">Date & Time</h4>
                                                                    <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()} at {event.time}</p>
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
                                                                disabled={processing === event.id}
                                                                onClick={() => handleReject(event.id)}
                                                            >
                                                                <XCircle className="h-4 w-4 mr-1" />
                                                                {processing === event.id ? "Processing..." : "Reject"}
                                                            </Button>
                                                            <Button
                                                                className="bg-green-600 hover:bg-green-700"
                                                                disabled={processing === event.id}
                                                                onClick={() => handleApprove(event.id)}
                                                            >
                                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                                {processing === event.id ? "Processing..." : "Approve"}
                                                            </Button>
                                                        </DialogFooter>
                                                    </DialogContent>
                                                </Dialog>
                                                <Button
                                                    className="bg-green-600 hover:bg-green-700"
                                                    size="sm"
                                                    disabled={processing === event.id}
                                                    onClick={() => handleApprove(event.id)}
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    {processing === event.id ? "..." : "Approve"}
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={processing === event.id}
                                                    onClick={() => handleReject(event.id)}
                                                >
                                                    <XCircle className="h-4 w-4 mr-1" />
                                                    {processing === event.id ? "..." : "Reject"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <CheckCircle className="h-12 w-12 mx-auto text-green-400 mb-4" />
                            <h3 className="text-lg font-medium">All caught up!</h3>
                            <p className="text-muted-foreground">No pending events to review</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Recently Processed */}
            <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <CardTitle>Recently Processed</CardTitle>
                    <CardDescription>Your latest approval decisions</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Decision</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Notes</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentlyProcessed.map(event => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell>
                                        {event.status === "APPROVED" ? (
                                            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>
                                        ) : (
                                            <Badge variant="destructive">Rejected</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell>{new Date(event.processedAt).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-muted-foreground">
                                        {event.reason || "-"}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
