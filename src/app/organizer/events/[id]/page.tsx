"use client"

import { useState, useEffect } from "react"
import { API_URL } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Settings, Award, User, Mail, Phone, Loader2 } from "lucide-react"
import { format } from "date-fns"

interface Event {
    _id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    capacity: number
    status: string
    category: string
    organizer: {
        _id: string
        name: string
        email: string
    }
    registrations?: any[]
}

export default function EventDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const eventId = params.id as string
    const [event, setEvent] = useState<Event | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/auth/login?role=organizer')
                    return
                }

                const res = await fetch(`${API_URL}/api/events/${eventId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()
                    setEvent(data)
                } else {
                    console.error("Failed to fetch event")
                }
            } catch (error) {
                console.error("Error fetching event:", error)
            } finally {
                setLoading(false)
            }
        }

        if (eventId) {
            fetchEvent()
        }
    }, [eventId, router])

    const getStatusBadge = (status: string) => {
        const upperStatus = status.toUpperCase()
        switch (upperStatus) {
            case "APPROVED":
                return <Badge className="bg-primary/20 text-primary border-primary/30">Approved</Badge>
            case "PENDING":
                return <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">Pending Approval</Badge>
            case "COMPLETED":
                return <Badge className="bg-primary/20 text-primary border-primary/30">Completed</Badge>
            default:
                return <Badge variant="outline">{status}</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!event) {
        return (
            <div className="text-center py-12">
                <h3 className="text-lg font-medium">Event not found</h3>
                <Button asChild className="mt-4">
                    <Link href="/organizer/events">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Events
                    </Link>
                </Button>
            </div>
        )
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
                        <CardTitle className="text-2xl text-primary">{event.registrations?.length || 0}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Attended</CardDescription>
                        <CardTitle className="text-2xl text-primary">-</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Fill Rate</CardDescription>
                        <CardTitle className="text-2xl text-primary">
                            {Math.round(((event.registrations?.length || 0) / event.capacity) * 100)}%
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

                    {/* Additional Info */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle>Event Information</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div>
                                    <div className="font-medium mb-1">Category</div>
                                    <div className="text-sm text-muted-foreground">{event.category}</div>
                                </div>
                                <div>
                                    <div className="font-medium mb-1">Status</div>
                                    <div>{getStatusBadge(event.status)}</div>
                                </div>
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
                                    <div className="text-sm text-muted-foreground">{event.date ? format(new Date(event.date), 'PPP') : 'N/A'}</div>
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
                                    <div className="font-medium">Location</div>
                                    <div className="text-sm text-muted-foreground">{event.location}</div>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-medium">Capacity</div>
                                    <div className="text-sm text-muted-foreground">{event.registrations?.length || 0}/{event.capacity} spots filled</div>
                                </div>
                            </div>
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
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
