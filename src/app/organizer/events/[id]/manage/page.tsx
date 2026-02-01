"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Users, CheckCircle, XCircle, Download, Search, Mail, FileText, Award } from "lucide-react"

// Mock event data
const mockEvent = {
    id: "1",
    title: "AI & Machine Learning Summit 2026",
    date: "2026-02-15",
    time: "09:00 AM",
    location: "Tech Hub Convention Center",
    capacity: 500,
    status: "APPROVED"
}

// Mock registrations data
const mockRegistrations = [
    { id: "1", name: "John Doe", email: "john@example.com", registeredAt: "2026-01-20", status: "CONFIRMED", attendance: "PENDING", certificate: false },
    { id: "2", name: "Jane Smith", email: "jane@example.com", registeredAt: "2026-01-21", status: "CONFIRMED", attendance: "ATTENDED", certificate: true },
    { id: "3", name: "Mike Johnson", email: "mike@example.com", registeredAt: "2026-01-22", status: "CONFIRMED", attendance: "ATTENDED", certificate: true },
    { id: "4", name: "Sarah Williams", email: "sarah@example.com", registeredAt: "2026-01-23", status: "CONFIRMED", attendance: "ABSENT", certificate: false },
    { id: "5", name: "David Brown", email: "david@example.com", registeredAt: "2026-01-24", status: "CONFIRMED", attendance: "PENDING", certificate: false },
    { id: "6", name: "Emily Davis", email: "emily@example.com", registeredAt: "2026-01-25", status: "PENDING", attendance: "PENDING", certificate: false },
    { id: "7", name: "Chris Wilson", email: "chris@example.com", registeredAt: "2026-01-26", status: "CONFIRMED", attendance: "ATTENDED", certificate: true },
    { id: "8", name: "Lisa Anderson", email: "lisa@example.com", registeredAt: "2026-01-27", status: "CONFIRMED", attendance: "PENDING", certificate: false },
    { id: "9", name: "Tom Martinez", email: "tom@example.com", registeredAt: "2026-01-28", status: "CONFIRMED", attendance: "ATTENDED", certificate: false },
    { id: "10", name: "Amy Taylor", email: "amy@example.com", registeredAt: "2026-01-29", status: "CONFIRMED", attendance: "PENDING", certificate: false },
]

export default function ManageEventPage() {
    const params = useParams()
    const [searchTerm, setSearchTerm] = useState("")
    const [registrations, setRegistrations] = useState(mockRegistrations)
    const [loading, setLoading] = useState<string | null>(null)

    const filteredRegistrations = registrations.filter(reg =>
        reg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.email.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const stats = {
        total: registrations.length,
        confirmed: registrations.filter(r => r.status === "CONFIRMED").length,
        pending: registrations.filter(r => r.status === "PENDING").length,
        attended: registrations.filter(r => r.attendance === "ATTENDED").length,
        absent: registrations.filter(r => r.attendance === "ABSENT").length,
        certificatesIssued: registrations.filter(r => r.certificate).length
    }

    const markAttendance = async (regId: string, status: "ATTENDED" | "ABSENT") => {
        setLoading(regId)
        await new Promise(resolve => setTimeout(resolve, 500))
        setRegistrations(prev => prev.map(r =>
            r.id === regId ? { ...r, attendance: status } : r
        ))
        setLoading(null)
    }

    const issueCertificate = async (regId: string) => {
        setLoading(`cert-${regId}`)
        await new Promise(resolve => setTimeout(resolve, 500))
        setRegistrations(prev => prev.map(r =>
            r.id === regId ? { ...r, certificate: true } : r
        ))
        setLoading(null)
    }

    const issueAllCertificates = async () => {
        setLoading("all-certs")
        await new Promise(resolve => setTimeout(resolve, 1500))
        setRegistrations(prev => prev.map(r =>
            r.attendance === "ATTENDED" ? { ...r, certificate: true } : r
        ))
        setLoading(null)
    }

    const getAttendanceBadge = (status: string) => {
        switch (status) {
            case "ATTENDED":
                return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Attended</Badge>
            case "ABSENT":
                return <Badge variant="destructive">Absent</Badge>
            default:
                return <Badge variant="outline">Pending</Badge>
        }
    }

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
                    <p className="text-muted-foreground">{mockEvent.title}</p>
                </div>
            </div>

            {/* Event Info */}
            <Card className="bg-card/50 border-border/50">
                <CardContent className="py-4">
                    <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                            <span className="text-muted-foreground">Date: </span>
                            <span className="font-medium">{mockEvent.date}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Time: </span>
                            <span className="font-medium">{mockEvent.time}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Location: </span>
                            <span className="font-medium">{mockEvent.location}</span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">Capacity: </span>
                            <span className="font-medium">{mockEvent.capacity}</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid gap-4 md:grid-cols-6">
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Total</CardDescription>
                        <CardTitle className="text-2xl">{stats.total}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Confirmed</CardDescription>
                        <CardTitle className="text-2xl text-green-400">{stats.confirmed}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Pending</CardDescription>
                        <CardTitle className="text-2xl text-yellow-400">{stats.pending}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Attended</CardDescription>
                        <CardTitle className="text-2xl text-blue-400">{stats.attended}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Absent</CardDescription>
                        <CardTitle className="text-2xl text-red-400">{stats.absent}</CardTitle>
                    </CardHeader>
                </Card>
                <Card className="bg-card/50 border-border/50">
                    <CardHeader className="pb-2">
                        <CardDescription>Certificates</CardDescription>
                        <CardTitle className="text-2xl text-purple-400">{stats.certificatesIssued}</CardTitle>
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
                                        <TableRow key={reg.id}>
                                            <TableCell className="font-medium">{reg.name}</TableCell>
                                            <TableCell>{reg.email}</TableCell>
                                            <TableCell>{reg.registeredAt}</TableCell>
                                            <TableCell>
                                                {reg.status === "CONFIRMED" ? (
                                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Confirmed</Badge>
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
                                    {registrations.filter(r => r.status === "CONFIRMED").map(reg => (
                                        <TableRow key={reg.id}>
                                            <TableCell className="font-medium">{reg.name}</TableCell>
                                            <TableCell>{reg.email}</TableCell>
                                            <TableCell>{getAttendanceBadge(reg.attendance)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button
                                                        variant={reg.attendance === "ATTENDED" ? "default" : "outline"}
                                                        size="sm"
                                                        disabled={loading === reg.id}
                                                        onClick={() => markAttendance(reg.id, "ATTENDED")}
                                                        className={reg.attendance === "ATTENDED" ? "bg-green-600 hover:bg-green-700" : ""}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-1" /> Present
                                                    </Button>
                                                    <Button
                                                        variant={reg.attendance === "ABSENT" ? "destructive" : "outline"}
                                                        size="sm"
                                                        disabled={loading === reg.id}
                                                        onClick={() => markAttendance(reg.id, "ABSENT")}
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

                {/* Certificates Tab */}
                <TabsContent value="certificates">
                    <Card className="bg-card/50 border-border/50">
                        <CardHeader>
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <CardTitle>Issue Certificates</CardTitle>
                                    <CardDescription>Generate and issue certificates to attendees</CardDescription>
                                </div>
                                <Button
                                    onClick={issueAllCertificates}
                                    disabled={loading === "all-certs"}
                                >
                                    <Award className="h-4 w-4 mr-2" />
                                    {loading === "all-certs" ? "Issuing..." : "Issue All Certificates"}
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Attendance</TableHead>
                                        <TableHead>Certificate</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {registrations.filter(r => r.attendance === "ATTENDED").map(reg => (
                                        <TableRow key={reg.id}>
                                            <TableCell className="font-medium">{reg.name}</TableCell>
                                            <TableCell>{reg.email}</TableCell>
                                            <TableCell>{getAttendanceBadge(reg.attendance)}</TableCell>
                                            <TableCell>
                                                {reg.certificate ? (
                                                    <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Issued</Badge>
                                                ) : (
                                                    <Badge variant="outline">Not Issued</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {reg.certificate ? (
                                                    <Button variant="ghost" size="sm">
                                                        <Download className="h-4 w-4 mr-1" /> Download
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        disabled={loading === `cert-${reg.id}`}
                                                        onClick={() => issueCertificate(reg.id)}
                                                    >
                                                        <Award className="h-4 w-4 mr-1" />
                                                        {loading === `cert-${reg.id}` ? "Issuing..." : "Issue"}
                                                    </Button>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            {registrations.filter(r => r.attendance === "ATTENDED").length === 0 && (
                                <div className="text-center py-8">
                                    <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                                    <p className="text-muted-foreground">No attendees to issue certificates to yet.</p>
                                    <p className="text-sm text-muted-foreground">Mark attendance first in the Attendance tab.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
