"use client"

import { useEffect, useState, useCallback } from "react"
import { API_URL } from "@/lib/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Award, Plus, Loader2, RefreshCw, Eye } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

export default function OrganizerDashboard() {
    const router = useRouter()
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    const fetchEvents = useCallback(async () => {
        try {
            const token = localStorage.getItem('token')
            if (!token) {
                router.push('/auth/login')
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
            }
        } catch (error) {
            console.error("Failed to fetch events", error)
        } finally {
            setLoading(false)
        }
    }, [router])

    useEffect(() => {
        fetchEvents()
    }, [fetchEvents])

    // Refetch when user returns to the tab so participant counts stay up to date
    useEffect(() => {
        const onFocus = () => {
            const token = localStorage.getItem('token')
            if (token) fetchEvents()
        }
        window.addEventListener('focus', onFocus)
        return () => window.removeEventListener('focus', onFocus)
    }, [fetchEvents])

    const stats = [
        { title: "Events Created", value: events.length.toString(), icon: Calendar, description: "Total events" },
        { title: "Total Participants", value: events.reduce((acc, curr) => acc + (curr.registered || 0), 0).toString(), icon: Users, description: "Across all events" },
        { title: "Certificates Issued", value: "0", icon: Award, description: "Published" },
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
                <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="icon" onClick={() => fetchEvents()} title="Refresh" disabled={loading}>
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Link href="/organizer/events/create">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" /> Create Event
                        </Button>
                    </Link>
                </div>
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
                <h2 className="text-xl font-semibold">My Recent Events</h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Registered / Capacity</TableHead>
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
                                        <TableCell>{event.date ? format(new Date(event.date), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                                        <TableCell>{event.registered ?? 0} / {event.capacity}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                                Published
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-1">
                                                <Button variant="ghost" size="icon" asChild title="View">
                                                    <Link href={`/organizer/events/${event._id}`}>
                                                        <Eye className="h-4 w-4" />
                                                    </Link>
                                                </Button>
                                                <Button variant="ghost" size="sm" asChild>
                                                    <Link href={`/organizer/events/${event._id}/manage`}>
                                                        Manage
                                                    </Link>
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
