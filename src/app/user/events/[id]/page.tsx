"use client"

import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Clock, MapPin, Users, Award, CheckCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function UserEventDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const eventId = params.id as string
    
    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [registering, setRegistering] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        const fetchEventAndRegistration = async () => {
            try {
                // Fetch event details
                const res = await fetch(`http://localhost:5000/api/events/${eventId}`)
                if (!res.ok) throw new Error("Failed to fetch event details")
                const data = await res.json()
                setEvent(data)

                // Check registration status (if logged in)
                const token = localStorage.getItem("token")
                if (token) {
                    const regRes = await fetch(`http://localhost:5000/api/registrations/my`, {
                        headers: { Authorization: `Bearer ${token}` }
                    })
                    if (regRes.ok) {
                        const myRegistrations = await regRes.json()
                        const isReg = myRegistrations.some((r: any) => r.event._id === eventId || r.event === eventId)
                        setIsRegistered(isReg)
                    }
                }
            } catch (err) {
                console.error(err)
                setError("Failed to load event details")
            } finally {
                setLoading(false)
            }
        }

        fetchEventAndRegistration()
    }, [eventId])

    const handleRegister = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push("/auth/login")
            return
        }

        setRegistering(true)
        try {
            const res = await fetch(`http://localhost:5000/api/registrations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ eventId })
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.message || "Failed to register")
            }

            setIsRegistered(true)
            toast({
                title: "Success",
                description: "You have successfully registered for this event!",
            })
            
            // Refresh event to update count
            const eventRes = await fetch(`http://localhost:5000/api/events/${eventId}`)
            if (eventRes.ok) {
                const eventData = await eventRes.json()
                setEvent(eventData)
            }

        } catch (err: any) {
            toast({
                variant: "destructive",
                title: "Error",
                description: err.message,
            })
        } finally {
            setRegistering(false)
        }
    }

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader2 className="h-8 w-8 animate-spin" /></div>
    }

    if (error || !event) {
        return (
            <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
                <p className="text-destructive text-lg font-medium">{error || "Event not found"}</p>
                <Button asChild variant="outline">
                    <Link href="/user/events">Back to Events</Link>
                </Button>
            </div>
        )
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
            <div className="h-48 md:h-64 rounded-lg overflow-hidden relative bg-muted">
                {event.imageUrl ? (
                    <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/30 to-secondary/30">
                        <Calendar className="h-20 w-20 text-primary/50" />
                    </div>
                )}
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
                            <p className="text-muted-foreground whitespace-pre-line">{event.description}</p>
                        </CardContent>
                    </Card>

                    {/* Schedule - Only show if exists (optional future feature) */}
                    {event.schedule && event.schedule.length > 0 && (
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
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Registration Card */}
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle>Register Now</CardTitle>
                            <CardDescription>
                                {event.registered || 0}/{event.capacity} spots filled
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="w-full bg-secondary rounded-full h-2">
                                <div
                                    className="bg-primary rounded-full h-2"
                                    style={{ width: `${Math.min(((event.registered || 0) / event.capacity) * 100, 100)}%` }}
                                />
                            </div>
                            {isRegistered ? (
                                <div className="text-center py-4">
                                    <CheckCircle className="h-12 w-12 text-primary mx-auto mb-2" />
                                    <p className="font-medium text-primary">You are registered!</p>
                                    <p className="text-sm text-muted-foreground">Check your email for details</p>
                                </div>
                            ) : (
                                <Button
                                    className="w-full"
                                    size="lg"
                                    disabled={registering || (event.registered || 0) >= event.capacity}
                                    onClick={handleRegister}
                                >
                                    {registering ? "Registering..." : (event.registered || 0) >= event.capacity ? "Event Full" : "Register for Event"}
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
                                    <div className="text-sm text-muted-foreground">{new Date(event.date).toLocaleDateString()}</div>
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
                                    {/* <div className="text-sm text-muted-foreground">{event.address}</div> */}
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <Users className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-medium">Capacity</div>
                                    <div className="text-sm text-muted-foreground">{event.capacity - (event.registered || 0)} spots remaining</div>
                                </div>
                            </div>
                            {/* Certificate info is optional as it's not in the model yet */}
                            {/* <div className="flex items-start gap-3">
                                <Award className="h-5 w-5 text-primary mt-0.5" />
                                <div>
                                    <div className="font-medium">Certificate</div>
                                    <div className="text-sm text-muted-foreground">Issued upon attendance</div>
                                </div>
                            </div> */}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}