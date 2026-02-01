"use client"

import Link from "next/link"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users } from "lucide-react"

export default function EventsPage() {
    const events = [
        {
            id: 1,
            title: "AI in Education Summit",
            date: "2024-03-15",
            time: "10:00 AM",
            location: "Auditorium A",
            capacity: 200,
            registered: 154,
            type: "Conference",
            banner: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=800&q=80",
        },
        {
            id: 2,
            title: "Web Dev Bootcamp",
            date: "2024-03-20",
            time: "09:00 AM",
            location: "Online",
            capacity: 50,
            registered: 48,
            type: "Workshop",
            banner: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
        },
        {
            id: 3,
            title: "Campus Music Fest",
            date: "2024-04-05",
            time: "06:00 PM",
            location: "Open Grounds",
            capacity: 500,
            registered: 120,
            type: "Cultural",
            banner: "https://images.unsplash.com/photo-1459749411177-287ce328810e?w=800&q=80",
        },
    ]

    return (
        <PublicLayout>
            <div className="container py-12">
                <div className="flex flex-col space-y-4 mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">Upcoming Events</h1>
                    <p className="text-muted-foreground">Discover and register for events happening around you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {events.map((event) => (
                        <Card key={event.id} className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow border-primary/10">
                            <div className="aspect-video relative">
                                {/* Placeholder for Next/Image, using simple img for mock */}
                                <img
                                    src={event.banner}
                                    alt={event.title}
                                    className="object-cover w-full h-full opacity-90 hover:opacity-100 transition-opacity"
                                />
                                <Badge className="absolute top-2 right-2 bg-background/80 backdrop-blur text-foreground hover:bg-background">
                                    {event.type}
                                </Badge>
                            </div>
                            <CardHeader className="p-4">
                                <h3 className="font-bold text-lg leading-none">{event.title}</h3>
                                <div className="flex items-center text-sm text-muted-foreground mt-2">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    {event.date} • {event.time}
                                </div>
                            </CardHeader>
                            <CardContent className="p-4 pt-0 flex-1">
                                <div className="flex items-center text-sm text-muted-foreground mb-2">
                                    <MapPin className="mr-2 h-4 w-4" />
                                    {event.location}
                                </div>
                                <div className="flex items-center text-sm text-muted-foreground">
                                    <Users className="mr-2 h-4 w-4" />
                                    {event.registered} / {event.capacity} Registered
                                </div>
                                {/* Progress bar simulation */}
                                <div className="h-1 w-full bg-secondary mt-3 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter className="p-4 border-t bg-card/50">
                                <Link href={`/events/${event.id}`} className="w-full">
                                    <Button className="w-full" variant={event.registered >= event.capacity ? "secondary" : "default"}>
                                        {event.registered >= event.capacity ? "Waitlist" : "View Details"}
                                    </Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </PublicLayout>
    )
}
