"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, MapPin, Clock, Download, MessageSquare, X, Eye } from "lucide-react"

// Mock data for user's registrations
const mockRegistrations = [
    {
        id: "1",
        eventId: "1",
        eventTitle: "AI & Machine Learning Summit 2026",
        eventDate: "2026-02-15",
        eventTime: "09:00 AM",
        eventLocation: "Tech Hub Convention Center",
        registeredAt: "2026-01-25",
        status: "CONFIRMED",
        attendance: "PENDING",
        certificate: null
    },
    {
        id: "2",
        eventId: "2",
        eventTitle: "Web Development Bootcamp",
        eventDate: "2026-01-20",
        eventTime: "10:00 AM",
        eventLocation: "Digital Learning Center",
        registeredAt: "2026-01-10",
        status: "CONFIRMED",
        attendance: "ATTENDED",
        certificate: "/certificates/cert-2.pdf"
    },
    {
        id: "3",
        eventId: "3",
        eventTitle: "Startup Pitch Competition",
        eventDate: "2026-01-15",
        eventTime: "02:00 PM",
        eventLocation: "Innovation Campus",
        registeredAt: "2026-01-05",
        status: "CONFIRMED",
        attendance: "ABSENT",
        certificate: null
    },
    {
        id: "4",
        eventId: "4",
        eventTitle: "Cloud Computing Conference",
        eventDate: "2026-01-10",
        eventTime: "09:00 AM",
        eventLocation: "Cloud Arena",
        registeredAt: "2026-01-02",
        status: "CONFIRMED",
        attendance: "ATTENDED",
        certificate: "/certificates/cert-4.pdf"
    },
    {
        id: "5",
        eventId: "5",
        eventTitle: "Design Thinking Workshop",
        eventDate: "2026-03-15",
        eventTime: "11:00 AM",
        eventLocation: "Creative Studio",
        registeredAt: "2026-01-28",
        status: "PENDING",
        attendance: "PENDING",
        certificate: null
    }
]

export default function MyRegistrationsPage() {
    const [cancelling, setCancelling] = useState<string | null>(null)

    const handleCancel = async (regId: string) => {
        setCancelling(regId)
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert("Registration cancelled successfully!")
        setCancelling(null)
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Confirmed</Badge>
            case "PENDING":
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
            case "CANCELLED":
                return <Badge variant="destructive">Cancelled</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    const getAttendanceBadge = (attendance: string) => {
        switch (attendance) {
            case "ATTENDED":
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Attended</Badge>
            case "ABSENT":
                return <Badge variant="destructive">Absent</Badge>
            case "PENDING":
                return <Badge variant="outline">Upcoming</Badge>
            default:
                return <Badge variant="outline">{attendance}</Badge>
        }
    }

    const upcomingRegistrations = mockRegistrations.filter(r => new Date(r.eventDate) >= new Date())
    const pastRegistrations = mockRegistrations.filter(r => new Date(r.eventDate) < new Date())

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">My Registrations</h1>
                <p className="text-muted-foreground">View and manage your event registrations</p>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Total Registrations</CardDescription>
                        <CardTitle className="text-3xl text-primary">{mockRegistrations.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Upcoming Events</CardDescription>
                        <CardTitle className="text-3xl text-blue-400">{upcomingRegistrations.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Attended</CardDescription>
                        <CardTitle className="text-3xl text-green-400">
                            {mockRegistrations.filter(r => r.attendance === "ATTENDED").length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Certificates Earned</CardDescription>
                        <CardTitle className="text-3xl text-yellow-400">
                            {mockRegistrations.filter(r => r.certificate).length}
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Upcoming Registrations */}
            <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <CardTitle>Upcoming Events</CardTitle>
                    <CardDescription>Events you&apos;re registered for</CardDescription>
                </CardHeader>
                <CardContent>
                    {upcomingRegistrations.length > 0 ? (
                        <div className="space-y-4">
                            {upcomingRegistrations.map(reg => (
                                <Card key={reg.id} className="bg-background/50 border-border/30">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{reg.eventTitle}</h3>
                                                    {getStatusBadge(reg.status)}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(reg.eventDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {reg.eventTime}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {reg.eventLocation}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/user/events/${reg.eventId}`}>
                                                        <Eye className="h-4 w-4 mr-1" /> View
                                                    </Link>
                                                </Button>
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={cancelling === reg.id}
                                                    onClick={() => handleCancel(reg.id)}
                                                >
                                                    <X className="h-4 w-4 mr-1" />
                                                    {cancelling === reg.id ? "Cancelling..." : "Cancel"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                            <p className="text-muted-foreground">No upcoming events</p>
                            <Button className="mt-4" asChild>
                                <Link href="/user/events">Browse Events</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Past Registrations */}
            <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <CardTitle>Past Events</CardTitle>
                    <CardDescription>Your event history</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Attendance</TableHead>
                                <TableHead>Certificate</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pastRegistrations.map(reg => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">{reg.eventTitle}</TableCell>
                                    <TableCell>{new Date(reg.eventDate).toLocaleDateString()}</TableCell>
                                    <TableCell>{getAttendanceBadge(reg.attendance)}</TableCell>
                                    <TableCell>
                                        {reg.certificate ? (
                                            <Button variant="ghost" size="sm" className="text-green-400">
                                                <Download className="h-4 w-4 mr-1" /> Download
                                            </Button>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        {reg.attendance === "ATTENDED" && (
                                            <Button variant="ghost" size="sm">
                                                <MessageSquare className="h-4 w-4 mr-1" /> Feedback
                                            </Button>
                                        )}
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
