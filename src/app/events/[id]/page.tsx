"use client"

import { useState } from "react"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Users, Share2, Clock, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function EventDetailsPage({ params }: { params: { id: string } }) {
    // Mock data fetching based on ID
    const event = {
        id: params.id,
        title: "AI in Education Summit",
        description: "Join us for an immersive summit exploring the transformative role of Artificial Intelligence in modern education. Features keynote speakers from top universities and hands-on workshops.",
        date: "2024-03-15",
        startTime: "10:00 AM",
        endTime: "04:00 PM",
        location: "Auditorium A, Block 3",
        capacity: 200,
        registered: 154,
        type: "Conference",
        banner: "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=1200&q=80",
        organizer: "Dr. Smith",
        status: "OPEN"
    }

    const [isRegistered, setIsRegistered] = useState(false)
    const [loading, setLoading] = useState(false)
    // const { toast } = useToast() 

    const handleRegister = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setIsRegistered(true)
            // toast({ title: "Registered!", description: "You have successfully registered." })
        }, 1500)
    }

    return (
        <PublicLayout>
            {/* Hero Section */}
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                <img
                    src={event.banner}
                    alt={event.title}
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-0 left-0 container py-8">
                    <Badge className="mb-4">{event.type}</Badge>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
                    <div className="flex flex-wrap gap-4 text-muted-foreground text-sm md:text-base">
                        <span className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> {event.date}</span>
                        <span className="flex items-center"><Clock className="mr-2 h-4 w-4" /> {event.startTime} - {event.endTime}</span>
                        <span className="flex items-center"><MapPin className="mr-2 h-4 w-4" /> {event.location}</span>
                    </div>
                </div>
            </div>

            <div className="container py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">About This Event</h2>
                        <p className="text-muted-foreground leading-relaxed">
                            {event.description}
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">Instructions</h2>
                        <ul className="list-disc list-inside text-muted-foreground space-y-2">
                            <li>Please arrive 15 minutes before the start time.</li>
                            <li>Carry your student ID card.</li>
                            <li>Laptops are recommended for workshops.</li>
                        </ul>
                    </section>
                </div>

                {/* Sidebar Actions */}
                <div className="space-y-6">
                    <Card className="border-primary/20 sticky top-24">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <span>Registration Status</span>
                                <Badge variant={event.status === 'OPEN' ? 'default' : 'secondary'}>{event.status}</Badge>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Capacity</span>
                                    <span className="font-medium">{event.registered} / {event.capacity}</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                                    />
                                </div>
                                {event.registered >= event.capacity && (
                                    <p className="text-xs text-yellow-500 flex items-center">
                                        <AlertCircle className="mr-1 h-3 w-3" /> Event is nearly full!
                                    </p>
                                )}
                            </div>

                            <Button
                                className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20"
                                onClick={handleRegister}
                                disabled={isRegistered || loading || event.registered >= event.capacity}
                            >
                                {loading ? "Processing..." : isRegistered ? "You are Registered" : event.registered >= event.capacity ? "Join Waitlist" : "Register Now"}
                            </Button>

                            <p className="text-xs text-center text-muted-foreground">
                                By registering, you agree to the event terms.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </PublicLayout>
    )
}
