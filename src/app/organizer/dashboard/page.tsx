"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Users, Award, Plus } from "lucide-react"
import Link from "next/link"

export default function OrganizerDashboard() {
    // Mock data
    const stats = [
        { title: "Events Created", value: "8", icon: Calendar, description: "Total events" },
        { title: "Total Participants", value: "342", icon: Users, description: "Across all events" },
        { title: "Certificates Issued", value: "156", icon: Award, description: "Published" },
    ]

    const myEvents = [
        { id: 1, title: "Intro to React", date: "2024-03-25", participants: 45, status: "APPROVED" },
        { id: 2, title: "Data Science Workshop", date: "2024-04-10", participants: 120, status: "PENDING" },
        { id: 3, title: "Design Systems Talk", date: "2024-02-15", participants: 88, status: "COMPLETED" },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Organizer Dashboard</h1>
                <Link href="/organizer/events/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" /> Create Event
                    </Button>
                </Link>
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
                <h2 className="text-xl font-semibold">My Recent Events</h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Participants</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {myEvents.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell className="font-medium">{event.title}</TableCell>
                                    <TableCell>{event.date}</TableCell>
                                    <TableCell>{event.participants}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            event.status === 'APPROVED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                event.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' :
                                                    'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                        }>
                                            {event.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="sm" asChild>
                                            <Link href={`/organizer/events/${event.id}/manage`}>
                                                Manage
                                            </Link>
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
