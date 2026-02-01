"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Search, Clock, ArrowRight } from "lucide-react"

// Mock data for available events
const mockEvents = [
    {
        id: "1",
        title: "AI & Machine Learning Summit 2026",
        description: "Explore the latest advancements in AI and machine learning with industry experts.",
        date: "2026-02-15",
        time: "09:00 AM",
        location: "Tech Hub Convention Center",
        capacity: 500,
        registered: 342,
        category: "Technology",
        image: "/event-placeholder.jpg",
        status: "OPEN"
    },
    {
        id: "2",
        title: "Startup Pitch Competition",
        description: "Watch innovative startups pitch their ideas to top investors.",
        date: "2026-02-20",
        time: "02:00 PM",
        location: "Innovation Campus",
        capacity: 200,
        registered: 198,
        category: "Business",
        image: "/event-placeholder.jpg",
        status: "ALMOST_FULL"
    },
    {
        id: "3",
        title: "Web Development Bootcamp",
        description: "Hands-on workshop covering React, Next.js, and modern web technologies.",
        date: "2026-03-01",
        time: "10:00 AM",
        location: "Digital Learning Center",
        capacity: 50,
        registered: 50,
        category: "Workshop",
        image: "/event-placeholder.jpg",
        status: "FULL"
    },
    {
        id: "4",
        title: "Cloud Computing Conference",
        description: "Deep dive into AWS, Azure, and GCP with hands-on labs.",
        date: "2026-03-10",
        time: "09:00 AM",
        location: "Cloud Arena",
        capacity: 300,
        registered: 156,
        category: "Technology",
        image: "/event-placeholder.jpg",
        status: "OPEN"
    },
    {
        id: "5",
        title: "Design Thinking Workshop",
        description: "Learn human-centered design principles and methodologies.",
        date: "2026-03-15",
        time: "11:00 AM",
        location: "Creative Studio",
        capacity: 40,
        registered: 28,
        category: "Workshop",
        image: "/event-placeholder.jpg",
        status: "OPEN"
    },
    {
        id: "6",
        title: "Cybersecurity Awareness Seminar",
        description: "Essential security practices for modern organizations.",
        date: "2026-03-20",
        time: "03:00 PM",
        location: "Security Center",
        capacity: 150,
        registered: 89,
        category: "Technology",
        image: "/event-placeholder.jpg",
        status: "OPEN"
    }
]

const categories = ["All", "Technology", "Business", "Workshop"]

export default function AvailableEventsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [registering, setRegistering] = useState<string | null>(null)

    const filteredEvents = mockEvents.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleRegister = async (eventId: string) => {
        setRegistering(eventId)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        alert("Successfully registered for the event!")
        setRegistering(null)
    }

    const getStatusBadge = (status: string, registered: number, capacity: number) => {
        if (status === "FULL") {
            return <Badge variant="destructive">Full</Badge>
        }
        if (registered / capacity > 0.9) {
            return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Almost Full</Badge>
        }
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Open</Badge>
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold">Available Events</h1>
                <p className="text-muted-foreground">Browse and register for upcoming events</p>
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
                    {categories.map(category => (
                        <Button
                            key={category}
                            variant={selectedCategory === category ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCategory(category)}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map(event => (
                    <Card key={event.id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                        <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <Calendar className="h-16 w-16 text-primary/50" />
                        </div>
                        <CardHeader className="pb-2">
                            <div className="flex items-start justify-between gap-2">
                                <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
                                    {event.title}
                                </CardTitle>
                                {getStatusBadge(event.status, event.registered, event.capacity)}
                            </div>
                            <CardDescription className="line-clamp-2">
                                {event.description}
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pb-2 space-y-2 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                <span className="truncate">{event.location}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                <span>{event.registered}/{event.capacity} registered</span>
                            </div>
                        </CardContent>
                        <CardFooter className="pt-2 flex gap-2">
                            <Button
                                className="flex-1"
                                disabled={event.status === "FULL" || registering === event.id}
                                onClick={() => handleRegister(event.id)}
                            >
                                {registering === event.id ? "Registering..." : event.status === "FULL" ? "Full" : "Register Now"}
                            </Button>
                            <Button variant="outline" size="icon" asChild>
                                <Link href={`/user/events/${event.id}`}>
                                    <ArrowRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                ))}
            </div>

            {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                    <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium">No events found</h3>
                    <p className="text-muted-foreground">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    )
}
