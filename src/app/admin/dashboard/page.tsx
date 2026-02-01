"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, FileClock, CheckCircle, XCircle } from "lucide-react"

export default function AdminDashboard() {
    // Mock data
    const stats = [
        { title: "Total Events", value: "24", icon: Calendar, description: "+4 this month" },
        { title: "Pending Approvals", value: "3", icon: FileClock, description: "Action needed" },
        { title: "Total Registrations", value: "1,250", icon: Users, description: "+120 this week" },
    ]

    const pendingEvents = [
        { id: 1, title: "AI in Education Summit", organizer: "Dr. Smith", date: "2024-03-15", status: "PENDING" },
        { id: 2, title: "Web Dev Bootcamp", organizer: "Tech Club", date: "2024-03-20", status: "PENDING" },
        { id: 3, title: "Campus Music Fest", organizer: "Student Council", date: "2024-04-05", status: "PENDING" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
                {stats.map((stat, index) => (
                    <Card key={index}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.description}
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Pending Event Approvals</h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Title</TableHead>
                                <TableHead>Organizer</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pendingEvents.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell>{event.organizer}</TableCell>
                                    <TableCell>{event.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">
                                            {event.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button size="sm" variant="outline" className="text-green-500 border-green-500/20 hover:bg-green-500/10">
                                            <CheckCircle className="h-4 w-4 mr-1" /> Approve
                                        </Button>
                                        <Button size="sm" variant="outline" className="text-red-500 border-red-500/20 hover:bg-red-500/10">
                                            <XCircle className="h-4 w-4 mr-1" /> Reject
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}
