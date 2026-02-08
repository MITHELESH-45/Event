"use client"
import { useEffect, useState } from "react"
import { API_URL } from "@/lib/api"
import Link from "next/link"
import Image from "next/image"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"
import { format } from "date-fns"

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await fetch(`${API_URL}/api/events`)
                if (res.ok) {
                    const data = await res.json()
                    // Filter only approved events for public view
                    const approvedEvents = data.filter((e: any) => e.status === 'approved')
                    setEvents(approvedEvents)
                }
            } catch (error) {
                console.error("Failed to fetch events", error)
            } finally {
                setLoading(false)
            }
        }

        fetchEvents()
    }, [])

    if (loading) {
        return (
            <PublicLayout>
                <div className="container py-12 flex justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
            </PublicLayout>
        )
    }

    return (
        <PublicLayout>
            <div className="container py-12">
                <div className="flex flex-col space-y-4 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
                    <p className="text-muted-foreground">Discover and register for events happening around you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.length === 0 ? (
                        <div className="col-span-full text-center py-12 text-muted-foreground">
                            No upcoming events found. Check back later!
                        </div>
                    ) : (
                        events.map((event) => (
                            <Card key={event._id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow border-primary/10">
                                <div className="aspect-video relative bg-muted">
                                    {event.imageUrl ? (
                                        <Image
                                            src={event.imageUrl}
                                            alt={event.title}
                                            fill
                                            className="object-cover transition-opacity opacity-90 hover:opacity-100"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-muted-foreground">
                                            <Calendar className="h-12 w-12 opacity-20" />
                                        </div>
                                    )}
                                    <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur text-foreground hover:bg-background">
                                        {event.category || 'General'}
                                    </Badge>
                                </div>
                                <CardHeader className="p-4">
                                    <h3 className="font-bold text-lg leading-none line-clamp-1">{event.title}</h3>
                                    <div className="flex items-center text-sm text-muted-foreground mt-2">
                                        <Calendar className="mr-2 h-4 w-4" />
                                        {event.date ? format(new Date(event.date), 'PPP') : 'N/A'} • {event.time}
                                    </div>
                                </CardHeader>
                                <CardContent className="p-4 pt-0 flex-1">
                                    <div className="flex items-center text-sm text-muted-foreground mb-2">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        {event.location}
                                    </div>
                                    <div className="flex items-center text-sm text-muted-foreground">
                                        <Users className="mr-2 h-4 w-4" />
                                        {event.registered || 0} / {event.capacity} Registered
                                    </div>
                                    {/* Progress bar simulation */}
                                    <div className="h-1 w-full bg-secondary mt-3 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-primary"
                                            style={{ width: `${Math.min(100, ((event.registered || 0) / event.capacity) * 100)}%` }}
                                        />
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 border-t bg-card/50">
                                    <Link href={`/events/${event._id}`} className="w-full">
                                        <Button className="w-full" variant={(event.registered || 0) >= event.capacity ? "secondary" : "default"}>
                                            {(event.registered || 0) >= event.capacity ? "Waitlist" : "View Details"}
                                        </Button>
                                    </Link>
                                </CardFooter>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </PublicLayout>
    )
}
