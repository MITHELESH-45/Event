"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Users, Search, Plus, Settings, Eye, BarChart3, CheckCircle, Clock, XCircle } from "lucide-react"

// Mock data for organizer's events
const mockEvents = [
    {
        id: "1",
        title: "AI & Machine Learning Summit 2026",
        date: "2026-02-15",
        time: "09:00 AM",
        location: "Tech Hub Convention Center",
        capacity: 500,
        registered: 342,
        attended: 0,
        status: "APPROVED",
        certificatesIssued: 0
    },
    {
        id: "2",
        title: "Web Development Bootcamp",
        date: "2026-01-20",
        time: "10:00 AM",
        location: "Digital Learning Center",
        capacity: 50,
        registered: 48,
        attended: 45,
        status: "COMPLETED",
        certificatesIssued: 45
    },
    {
        id: "3",
        title: "Startup Pitch Competition",
        date: "2026-01-15",
        time: "02:00 PM",
        location: "Innovation Campus",
        capacity: 200,
        registered: 180,
        attended: 165,
        status: "COMPLETED",
        certificatesIssued: 150
    },
    {
        id: "4",
        title: "Cloud Computing Conference",
        date: "2026-03-10",
        time: "09:00 AM",
        location: "Cloud Arena",
        capacity: 300,
        registered: 156,
        attended: 0,
        status: "PENDING",
        certificatesIssued: 0
    },
    {
        id: "5",
        title: "Design Thinking Workshop",
        date: "2026-03-15",
        time: "11:00 AM",
        location: "Creative Studio",
        capacity: 40,
        registered: 28,
        attended: 0,
        status: "APPROVED",
        certificatesIssued: 0
    }
]

export default function MyEventsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("ALL")

    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesStatus = statusFilter === "ALL" || event.status === statusFilter
        return matchesSearch && matchesStatus
    })

    const getStatusBadge = (status: string) => {
        switch (status) {
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
        total: mockEvents.length,
        approved: mockEvents.filter(e => e.status === "APPROVED").length,
        pending: mockEvents.filter(e => e.status === "PENDING").length,
        completed: mockEvents.filter(e => e.status === "COMPLETED").length,
        totalRegistrations: mockEvents.reduce((sum, e) => sum + e.registered, 0),
        totalAttended: mockEvents.reduce((sum, e) => sum + e.attended, 0)
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
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <div>
                                            <div className="font-medium">{event.title}</div>
                                            <div className="text-sm text-muted-foreground">{event.location}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">
                                            <div>{event.date}</div>
                                            <div className="text-muted-foreground">{event.time}</div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{getStatusBadge(event.status)}</TableCell>
                                    <TableCell className="text-center">
                                        <span className="font-medium">{event.registered}</span>
                                        <span className="text-muted-foreground">/{event.capacity}</span>
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {event.status === "COMPLETED" ? (
                                            <span className="font-medium text-primary">{event.attended}</span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {event.certificatesIssued > 0 ? (
                                            <span className="font-medium text-primary">{event.certificatesIssued}</span>
                                        ) : (
                                            <span className="text-muted-foreground">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/organizer/events/${event.id}`}>
                                                    <Eye className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button variant="ghost" size="icon" asChild>
                                                <Link href={`/organizer/events/${event.id}/manage`}>
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
