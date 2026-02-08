"use client"

import { useState, useEffect } from "react"
import { API_URL } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Clock, X, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Registration {
    _id: string
    event: {
        _id: string
        title: string
        date: string
        time: string
        location: string
    }
    status: string
    createdAt: string
}

export default function MyRegistrationsPage() {
    const router = useRouter()
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)
    const [cancelling, setCancelling] = useState<string | null>(null)

    useEffect(() => {
        const token = localStorage.getItem('token')
        if (!token) {
            router.push('/auth/login')
            return
        }
        fetchRegistrations(token)
    }, [router])

    const fetchRegistrations = async (token: string) => {
        try {
            const res = await fetch(`${API_URL}/api/registrations/my`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            if (!res.ok) throw new Error('Failed to fetch registrations')
            const data = await res.json()
            setRegistrations(data)
        } catch (error) {
            console.error("Error fetching registrations:", error)
            toast.error("Failed to load registrations")
        } finally {
            setLoading(false)
        }
    }

    const handleCancel = async (regId: string) => {
        // Implement cancellation logic if API supports it
        toast.info("Cancellation feature coming soon")
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'attended':
                return <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Attended</Badge>
            case 'confirmed':
                return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Confirmed</Badge>
            case 'cancelled':
                return <Badge variant="outline" className="bg-red-500/10 text-red-500 border-red-500/20">Cancelled</Badge>
            default:
                return <Badge variant="outline" className="bg-muted text-muted-foreground border-muted-foreground/20">{status}</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    const upcomingRegistrations = registrations.filter(r => new Date(r.event.date) >= new Date())
    const pastRegistrations = registrations.filter(r => new Date(r.event.date) < new Date())

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
                        <CardTitle className="text-3xl text-primary">{registrations.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Upcoming Events</CardDescription>
                        <CardTitle className="text-3xl text-primary">{upcomingRegistrations.length}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Attended</CardDescription>
                        <CardTitle className="text-3xl text-primary">
                            {registrations.filter(r => r.status === "attended").length}
                        </CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Past Events</CardDescription>
                        <CardTitle className="text-3xl text-primary">
                            {pastRegistrations.length}
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
                                <Card key={reg._id} className="bg-background/50 border-border/30">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{reg.event.title}</h3>
                                                    {getStatusBadge(reg.status)}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(reg.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        {reg.event.time}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        {reg.event.location}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/user/events/${reg.event._id}`}>
                                                        <Eye className="h-4 w-4 mr-1" /> View
                                                    </Link>
                                                </Button>
                                                {/* Cancellation to be implemented */}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No upcoming events found.
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Past Registrations */}
            <Card className="bg-card/50 border-border/50">
                <CardHeader>
                    <CardTitle>Past Events</CardTitle>
                    <CardDescription>Events you&apos;ve attended or missed</CardDescription>
                </CardHeader>
                <CardContent>
                    {pastRegistrations.length > 0 ? (
                        <div className="space-y-4">
                            {pastRegistrations.map(reg => (
                                <Card key={reg._id} className="bg-background/50 border-border/30 opacity-75">
                                    <CardContent className="p-4">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-semibold">{reg.event.title}</h3>
                                                    {getStatusBadge(reg.status)}
                                                </div>
                                                <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        {new Date(reg.event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                 <Button variant="outline" size="sm" asChild>
                                                    <Link href={`/user/events/${reg.event._id}`}>
                                                        <Eye className="h-4 w-4 mr-1" /> View
                                                    </Link>
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            No past events found.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}