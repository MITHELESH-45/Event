"use client"

import { useState, useEffect } from "react"
import { API_URL } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Calendar, MapPin, Users, Search, Clock, Eye, Loader2 } from "lucide-react"
import { toast } from "sonner"

const categories = ["All", "Technology", "Business", "Workshop", "Health", "Art"]

interface Event {
    _id: string
    title: string
    description: string
    date: string
    time: string
    location: string
    capacity: number
    registered: number
    category: string
    status: string
    imageUrl?: string
}

export default function AvailableEventsPage() {
    const router = useRouter()
    const [events, setEvents] = useState<Event[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCategory, setSelectedCategory] = useState("All")
    const [registering, setRegistering] = useState<string | null>(null)

    useEffect(() => {
        fetchEvents()
    }, [])

    const fetchEvents = async () => {
        try {
            const res = await fetch(`${API_URL}/api/events`)
            if (!res.ok) throw new Error('Failed to fetch events')
            const data = await res.json()
            setEvents(data)
        } catch (error) {
            console.error("Error fetching events:", error)
            toast.error("Failed to load events")
        } finally {
            setLoading(false)
        }
    }

    const filteredEvents = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = selectedCategory === "All" || event.category === selectedCategory
        return matchesSearch && matchesCategory
    })

    const handleRegister = async (ev: Event) => {
        const token = localStorage.getItem('token')
        if (!token) {
            toast.error("Please login to register")
            router.push('/auth/login')
            return
        }
        if (ev.registered >= ev.capacity) {
            toast.error("This event is full. No more registrations can be accepted.")
            return
        }

        setRegistering(ev._id)
        try {
            const res = await fetch(`${API_URL}/api/registrations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ eventId: ev._id })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || 'Failed to register')
            }

            toast.success("Successfully registered for the event!")
            fetchEvents() // Refresh list to update counts
        } catch (error: any) {
            console.error("Registration error:", error)
            toast.error(error.message)
        } finally {
            setRegistering(null)
        }
    }

    const getStatusBadge = (status: string, registered: number, capacity: number) => {
        if (registered >= capacity) {
            return <Badge variant="destructive">Full</Badge>
        }
        if (registered / capacity > 0.9) {
            return <Badge className="bg-yellow-500/20 text-primary border-yellow-500/30">Almost Full</Badge>
        }
        return <Badge className="bg-primary/20 text-primary border-primary/30">Open</Badge>
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
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
                            className={selectedCategory === category ? "bg-primary text-primary-foreground" : ""}
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Events Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredEvents.map(event => (
                    <Card key={event._id} className="bg-card/50 border-border/50 hover:border-primary/30 transition-all duration-300 overflow-hidden group">
                        <div className="h-40 relative bg-muted overflow-hidden">
                            {event.imageUrl ? (
                                <img
                                    src={event.imageUrl}
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
                                    <Calendar className="h-16 w-16 text-primary/50" />
                                </div>
                            )}
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
                                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                                disabled={registering === event._id}
                                onClick={() => handleRegister(event)}
                            >
                                {registering === event._id ? "Registering..." : "Register Now"}
                            </Button>
                            <Button variant="outline" size="icon" asChild title="View details">
                                <Link href={`/user/events/${event._id}`}>
                                    <Eye className="h-4 w-4" />
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