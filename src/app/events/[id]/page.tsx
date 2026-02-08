"use client"

import { useState, useEffect } from "react"
import { API_URL } from "@/lib/api"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin, Users, Clock, AlertCircle, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

export default function EventDetailsPage() {
    const params = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const eventId = params.id as string

    const [event, setEvent] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [registering, setRegistering] = useState(false)
    const [isRegistered, setIsRegistered] = useState(false)

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await fetch(`${API_URL}/api/events/${eventId}`)
                if (res.ok) {
                    const data = await res.json()
                    setEvent(data)
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false)
            }
        }
        if (eventId) fetchEvent()
    }, [eventId])

    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token || !event) return
        fetch(`${API_URL}/api/registrations/my`, {
            headers: { Authorization: `Bearer ${token}` }
        })
            .then((r) => r.ok ? r.json() : [])
            .then((regs) => {
                const found = regs.some((r: any) => r.event?._id === eventId || r.event === eventId)
                setIsRegistered(found)
            })
            .catch(() => {})
    }, [eventId, event])

    const handleRegister = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
            router.push(`/auth/login?role=user`)
            return
        }
        setRegistering(true)
        try {
            const res = await fetch(`${API_URL}/api/registrations`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ eventId })
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || "Registration failed")
            setIsRegistered(true)
            setEvent((prev: any) => prev ? { ...prev, registered: (prev.registered || 0) + 1 } : prev)
            toast({ title: "Success", description: "You have successfully registered!" })
        } catch (err: any) {
            toast({ variant: "destructive", title: "Error", description: err.message })
        } finally {
            setRegistering(false)
        }
    }

    if (loading) {
        return (
            <PublicLayout>
                <div className="container py-12 flex justify-center min-h-[50vh]">
                    <Loader2 className="h-12 w-12 animate-spin text-primary" />
                </div>
            </PublicLayout>
        )
    }

    if (!event) {
        return (
            <PublicLayout>
                <div className="container py-12 text-center">
                    <p className="text-destructive text-lg">Event not found</p>
                    <Button asChild variant="outline" className="mt-4">
                        <Link href="/events">Back to Events</Link>
                    </Button>
                </div>
            </PublicLayout>
        )
    }

    const bannerUrl = event.imageUrl || "https://images.unsplash.com/photo-1544531586-fde5298cdd40?w=1200&q=80"

    return (
        <PublicLayout>
            <div className="relative h-[300px] md:h-[400px] w-full overflow-hidden">
                <img
                    src={bannerUrl}
                    alt={event.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
                <div className="absolute bottom-0 left-0 container py-8">
                    <Badge className="mb-4">{event.category || "Event"}</Badge>
                    <h1 className="text-3xl md:text-5xl font-bold mb-2">{event.title}</h1>
                    <div className="flex flex-wrap gap-4 text-muted-foreground text-sm md:text-base">
                        <span className="flex items-center"><Calendar className="mr-2 h-4 w-4" /> {event.date ? new Date(event.date).toLocaleDateString() : "TBD"}</span>
                        <span className="flex items-center"><Clock className="mr-2 h-4 w-4" /> {event.time || "TBD"}</span>
                        <span className="flex items-center"><MapPin className="mr-2 h-4 w-4" /> {event.location}</span>
                    </div>
                </div>
            </div>

            <div className="container py-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                        <h2 className="text-2xl font-bold">About This Event</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                            {event.description}
                        </p>
                    </section>
                </div>

                <div className="space-y-6">
                    <Card className="border-primary/20 sticky top-24">
                        <CardContent className="p-6 space-y-6">
                            <div className="flex justify-between items-center text-sm">
                                <span>Registration Status</span>
                                <Badge variant={(event.registered || 0) >= event.capacity ? "secondary" : "default"}>
                                    {(event.registered || 0) >= event.capacity ? "Full" : "Open"}
                                </Badge>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Capacity</span>
                                    <span className="font-medium">{event.registered || 0} / {event.capacity}</span>
                                </div>
                                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary"
                                        style={{ width: `${Math.min(100, ((event.registered || 0) / event.capacity) * 100)}%` }}
                                    />
                                </div>
                                {(event.registered || 0) >= event.capacity * 0.9 && (
                                    <p className="text-xs text-yellow-500 flex items-center">
                                        <AlertCircle className="mr-1 h-3 w-3" /> Event is nearly full!
                                    </p>
                                )}
                            </div>
                            <Button
                                className="w-full h-12 text-lg font-semibold shadow-lg shadow-primary/20"
                                onClick={handleRegister}
                                disabled={isRegistered || registering || (event.registered || 0) >= event.capacity}
                            >
                                {registering ? "Registering..." : isRegistered ? "You are Registered" : (event.registered || 0) >= event.capacity ? "Join Waitlist" : "Register Now"}
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
