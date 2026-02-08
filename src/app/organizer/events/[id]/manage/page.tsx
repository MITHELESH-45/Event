"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, CheckCircle, XCircle, Download, Search, Mail, Award, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"

interface Registration {
    _id: string
    user: {
        _id: string
        name: string
        email: string
    }
    status: string
    createdAt: string
    // Add these fields to model if needed, currently not in schema but used in UI
    attendance?: string 
    certificate?: boolean
}

interface Event {
    _id: string
    title: string
    date: string
    time: string
    location: string
    capacity: number
}

export default function ManageEventPage() {
    const params = useParams()
    const eventId = params.id as string
    const { toast } = useToast()
    
    const [event, setEvent] = useState<Event | null>(null)
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [actionLoading, setActionLoading] = useState<string | null>(null)

    useEffect(() => {
        const loadData = async () => {
            const token = localStorage.getItem('token')
            if (token && eventId) {
                try {
                    await Promise.all([
                        fetchEventDetails(token),
                        fetchRegistrations(token)
                    ])
                } catch (error) {
                    console.error("Error loading data:", error)
                } finally {
                    setLoading(false)
                }
            }
        }
        loadData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId])

    const fetchEventDetails = async (token: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/events/${eventId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch event')
            const data = await res.json()
            setEvent(data)
        } catch (error) {
            console.error("Error fetching event:", error)
        }
    }

    const fetchRegistrations = async (token: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/registrations/event/${eventId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
            if (!res.ok) throw new Error('Failed to fetch registrations')
            const data = await res.json()
            setRegistrations(data)
        } catch (error) {
            console.error("Error fetching registrations:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to load registrations"
            })
        }
    }

    const filteredRegistrations = registrations.filter(reg =>
        reg.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const stats = {
        total: registrations.length,
        confirmed: registrations.filter(r => r.status === "confirmed").length,
        pending: registrations.filter(r => r.status === "pending").length,
        attended: registrations.filter(r => r.status === "attended").length, // Using status for attendance for now
        certificatesIssued: registrations.filter(r => r.certificate).length
    }

    const markAttendance = async (regId: string, status: "attended" | "absent") => {
        setActionLoading(regId)
        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const body: any = { status }
            if (status === 'attended') {
                body.certificate = true
            } else {
                body.certificate = false
            }

            const res = await fetch(`http://localhost:5000/api/registrations/${regId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            })

            if (!res.ok) throw new Error('Failed to update status')
            
            // Optimistic update
            setRegistrations(prev => prev.map(r => 
                r._id === regId ? { ...r, status: status, certificate: status === 'attended' } : r
            ))
            toast({
                title: "Success",
                description: `Marked as ${status}`
            })
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update attendance"
            })
        } finally {
            setActionLoading(null)
        }
    }

    const getAttendanceBadge = (status: string) => {
        switch (status) {
            case "attended":
                return <Badge className="bg-primary/20 text-primary border-primary/30">Attended</Badge>
            case "absent":
                return <Badge variant="destructive">Absent</Badge>
            default:
                return <Badge variant="outline">Pending</Badge>
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    if (!event) return <div>Event not found</div>

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" asChild>
                    <Link href="/organizer/events">
                        <ArrowLeft className="h-4 w-4" />
                    </Link>
                </Button>
                <div>
                    <h1 className="text-2xl font-bold">Manage Event</h1>
                    <p className="text-muted-foreground">{event.title}</p>
                </div>
            </div>

            {/* Event Info */}
            <Card className="bg-card/50 border-border/50">
                <CardContent className="py-4">
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span className="font-medium">{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Time: </span>
                            <span className="font-medium">{event.time}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Location: </span>
                            <span className="font-medium">{event.location}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Capacity: </span>
                            <span className="font-medium">{event.capacity}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-5">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Total</CardDescription>
                        <CardTitle className="text-2xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Confirmed</CardDescription>
                        <CardTitle className="text-2xl text-primary">{stats.confirmed}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Pending</CardDescription>
                        <CardTitle className="text-2xl text-yellow-500">{stats.pending}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Attended</CardDescription>
                        <CardTitle className="text-2xl text-primary">{stats.attended}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Certificates</CardDescription>
                        <CardTitle className="text-2xl text-primary">{stats.certificatesIssued}</CardTitle>
                    </CardHeader>
                </Card>
            </div>

            {/* Tabs for different management sections */}
            <Tabs defaultValue="registrations" className="space-y-4">
                <TabsList className="bg-card/50">
                    <TabsTrigger value="registrations">
                        <Users className="h-4 w-4 mr-2" /> Registrations
                    </TabsTrigger>
                    <TabsTrigger value="attendance">
                        <CheckCircle className="h-4 w-4 mr-2" /> Attendance
                    </TabsTrigger>
                    <TabsTrigger value="certificates">
                        <Award className="h-4 w-4 mr-2" /> Certificates
                    </TabsTrigger>
                </TabsList>

                {/* Registrations Tab */}
                <TabsContent value="registrations">
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Registrations</CardTitle>
                                    <CardDescription>View and manage event registrations</CardDescription>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm">
                                        <Download className="h-4 w-4 mr-2" /> Export CSV
                                    </Button>
                                    <Button variant="outline" size="sm">
                                        <Mail className="h-4 w-4 mr-2" /> Email All
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="mb-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        placeholder="Search registrations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                            </div>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Registered</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredRegistrations.map(reg => (
                                        <TableRow key={reg._id}>
                                            <TableCell className="font-medium">{reg.user.name}</TableCell>
                                            <TableCell>{reg.user.email}</TableCell>
                                            <TableCell>{new Date(reg.createdAt).toLocaleDateString()}</TableCell>
                                            <TableCell>
                                                {reg.status === "confirmed" ? (
                                                    <Badge className="bg-primary/20 text-primary border-primary/30">Confirmed</Badge>
                                                ) : (
                                                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Pending</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">
                                                    <Mail className="h-4 w-4" />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Attendance Tab */}
                <TabsContent value="attendance">
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle>Mark Attendance</CardTitle>
                            <CardDescription>Record participant attendance for this event</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Attendance</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registrations.map(reg => (
                                        <TableRow key={reg._id}>
                                            <TableCell className="font-medium">{reg.user?.name || 'Unknown User'}</TableCell>
                                            <TableCell>{reg.user?.email || 'No Email'}</TableCell>
                                            <TableCell>{getAttendanceBadge(reg.status)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant={reg.status === "attended" ? "default" : "outline"}
                                                        size="sm"
                                                        disabled={actionLoading === reg._id}
                                                        onClick={() => markAttendance(reg._id, "attended")}
                                                        className={reg.status === "attended" ? "bg-primary hover:bg-primary/90 text-primary-foreground" : ""}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Present
                                                    </Button>
                                                    <Button
                                                        variant={reg.status === "absent" ? "destructive" : "outline"}
                                                        size="sm"
                                                        disabled={actionLoading === reg._id}
                                                        onClick={() => markAttendance(reg._id, "absent")}
                                                    >
                                                        <XCircle className="h-4 w-4 mr-1" /> Absent
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>
                
                {/* Certificates Tab - Placeholder */}
                <TabsContent value="certificates">
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <CardTitle>Certificates</CardTitle>
                            <CardDescription>Issue certificates to attendees</CardDescription>
                        </CardHeader>
                        <CardContent>
                             <div className="text-center py-8 text-muted-foreground">
                                Certificate generation enabled for attended participants.
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}