"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Settings, Award, User, Mail, Phone } from "lucide-react"

// Mock event data
const mockEvents: Record<string, any> = {
    "1": {
        id: "1",
        title: "AI & Machine Learning Summit 2026",
        description: "Explore the latest advancements in AI and machine learning with industry experts. This comprehensive summit features keynote speeches, hands-on workshops, and networking opportunities with leading professionals in the field.",
        date: "2026-02-15",
        time: "09:00 AM - 06:00 PM",
        location: "Tech Hub Convention Center",
        address: "123 Innovation Drive, Tech City, TC 12345",
        capacity: 500,
        registered: 342,
        attended: 0,
        status: "APPROVED",
        category: "Technology",
        organizer: {
            name: "Tech Events Inc.",
            email: "events@techevents.com",
            phone: "+1 234 567 8900"
        },
        schedule: [
            { time: "09:00 AM", title: "Registration & Welcome Coffee" },
            { time: "10:00 AM", title: "Keynote: The Future of AI" },
            { time: "11:30 AM", title: "Workshop: Building ML Models" },
            { time: "01:00 PM", title: "Lunch Break & Networking" },
            { time: "02:30 PM", title: "Panel: Ethics in AI" },
            { time: "04:00 PM", title: "Hands-on Lab Sessions" },
            { time: "05:30 PM", title: "Closing Remarks" }
        ],
        certificateEnabled: true
    },
    "2": {
        id: "2",
        title: "Web Development Bootcamp",
        description: "Intensive hands-on bootcamp covering modern web development technologies including React, Next.js, TypeScript, and more.",
        date: "2026-01-20",
        time: "10:00 AM - 05:00 PM",
        location: "Digital Learning Center",
        address: "456 Code Street, Dev Town, DT 67890",
        capacity: 50,
        registered: 48,
        attended: 45,
        status: "COMPLETED",
        category: "Workshop",
        organizer: {
            name: "CodeMasters Academy",
            email: "info@codemasters.dev",
            phone: "+1 345 678 9012"
        },
        schedule: [
            { time: "10:00 AM", title: "Introduction to Modern Web Dev" },
            { time: "11:00 AM", title: "React Fundamentals" },
            { time: "12:30 PM", title: "Lunch Break" },
            { time: "01:30 PM", title: "Next.js Deep Dive" },
            { time: "03:00 PM", title: "TypeScript Essentials" },
            { time: "04:30 PM", title: "Project Showcase" }
        ],
        certificateEnabled: true
    }
}

export default function EventDetailsPage() {
    const params = useParams()
    const eventId = params.id as string
    const event = mockEvents[eventId] || mockEvents["1"]

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "APPROVED":
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Approved</Badge>
            case "PENDING":
                return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending Approval</Badge>
            case "COMPLETED":
                return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Completed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/organizer/events">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold">{event.title}</h1>
                        {getStatusBadge(event.status)}
                    </div>
                    <p className="text-muted-foreground">{event.category}</p>
                </div>
                <Button asChild>
                    <Link href={`/organizer/events/${eventId}/manage`}>
                        <Settings className="h-4 w-4 mr-2" /> Manage Event
                    </Link>
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Capacity</CardDescription>
                        <CardTitle className="text-2xl">{event.capacity}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Registered</CardDescription>
                        <CardTitle className="text-2xl text-primary">{event.registered}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Attended</CardDescription>
                        <CardTitle className="text-2xl text-green-400">{event.attended}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Fill Rate</CardDescription>
                        <CardTitle className="text-2xl text-blue-400">
                            {Math.round((event.registered / event.capacity) * 100)}%
                        </CardTitle>
                    </CardHeader>
                </Card>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Description */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle>About This Event</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-muted-foreground">{event.description}</p>
                        </CardContent>
                    </Card>

                    {/* Schedule */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle>Event Schedule</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                {event.schedule.map((item: any, index: number) => (
                                    <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">

                                        <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                            <div className="w-3 h-3 bg-primary rounded-full" />
                                        </div>

                                        <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 shadow">
                                            <div className="flex items-center justify-between space-x-2 mb-1">
                                                <div className="font-bold text-slate-900">{item.title}</div>
                                                <time className="font-caveat font-medium text-amber-500">{item.time}</time>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Event Details */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle>Event Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-3">
                                <Calendar className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-medium">Date</div>
                                    <div className="text-sm text-muted-foreground">{event.date}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Clock className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-medium">Time</div>
                                    <div className="text-sm text-muted-foreground">{event.time}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <MapPin className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-medium">{event.location}</div>
                                    <div className="text-sm text-muted-foreground">{event.address}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-medium">Capacity</div>
                                    <div className="text-sm text-muted-foreground">{event.registered}/{event.capacity} spots filled</div>
                                </div>
                            </div>
                            {event.certificateEnabled && (
                                <div className="flex items-start gap-3">
                                    <Award className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="font-medium">Certificates</div>
                                        <div className="text-sm text-muted-foreground">Enabled for attendees</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Organizer Info */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle>Organizer</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="flex items-center gap-3">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{event.organizer.name}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Mail className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{event.organizer.email}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="h-4 w-4 text-muted-foreground" />
                                <span className="text-sm">{event.organizer.phone}</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
