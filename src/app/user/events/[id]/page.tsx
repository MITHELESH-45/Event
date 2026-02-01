"use client"

import { useParams } from "next/navigation"
import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Award, CheckCircle } from "lucide-react"

// Mock event data for participants
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
        status: "OPEN",
        category: "Technology",
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
    }
}

export default function UserEventDetailsPage() {
    const params = useParams()
    const eventId = params.id as string
    const event = mockEvents[eventId] || mockEvents["1"]
    const [registering, setRegistering] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)

    const handleRegister = async () => {
        setRegistering(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsRegistered(true)
        setRegistering(false)
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/user/events">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div className="flex-1">
                    <h1 className="text-2xl font-bold">{event.title}</h1>
                    <p className="text-muted-foreground">{event.category}</p>
                </div>
            </div>

            {/* Event Banner */}
            <div className="h-48 bg-gradient-to-br from-primary/30 to-secondary/30 rounded-lg flex items-center justify-center">
                <Calendar className="h-20 w-20 text-primary/50" />
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
                            <div className="space-y-4">
                                {event.schedule.map((item: any, index: number) => (
                                    <div key={index} className="flex gap-4 items-start">
                                        <div className="w-24 text-sm font-medium text-primary shrink-0">{item.time}</div>
                                        <div className="flex items-center gap-2">
                                            <div className="h-2 w-2 bg-primary rounded-full" />
                                            <p>{item.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Registration Card */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle>Register Now</CardTitle>
                            <CardDescription>
                                {event.registered}/{event.capacity} spots filled
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                    className="bg-primary rounded-full h-2"
                                    style={{ width: `${(event.registered / event.capacity) * 100}%` }}
                                />
                            </div>
                            {isRegistered ? (
                                <div className="text-center py-4">
                                    <CheckCircle className="h-12 w-12 text-green-400 mx-auto mb-2" />
                                    <p className="font-medium text-green-400">You are registered!</p>
                                    <p className="text-sm text-muted-foreground">Check your email for details</p>
                                </div>
                            ) : (
                                <Button
                                    className="w-full"
                                    size="lg"
                                    disabled={registering || event.registered >= event.capacity}
                                    onClick={handleRegister}
                                >
                                    {registering ? "Registering..." : "Register for Event"}
                                </Button>
                            )}
                        </CardContent>
                    </Card>

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
                                    <div className="text-sm text-muted-foreground">{event.capacity - event.registered} spots remaining</div>
                                </div>
                            </div>
                            {event.certificateEnabled && (
                                <div className="flex items-start gap-3">
                                    <Award className="h-5 w-5 text-primary mt-0.5" />
                                    <div>
                                        <div className="font-medium">Certificate</div>
                                        <div className="text-sm text-muted-foreground">Issued upon attendance</div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}
