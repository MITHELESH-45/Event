"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CheckSquare, Award, Download } from "lucide-react"
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog"

export default function UserDashboard() {
    // Mock data
    const stats = [
        { title: "Registered Events", value: "12", icon: Calendar, description: "Upcoming & Past" },
        { title: "Events Attended", value: "10", icon: CheckSquare, description: "Confirmed presence" },
        { title: "Certificates Earned", value: "8", icon: Award, description: "Available for download" },
    ]

    const registrations = [
        { id: 1, title: "Advanced CSS Techniques", date: "2024-03-23", status: "REGISTERED", certificate: false },
        { id: 2, title: "React Performance", date: "2024-02-10", status: "ATTENDED", certificate: true },
        { id: 3, title: "Node.js Basics", date: "2024-01-15", status: "ATTENDED", certificate: true },
    ]

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
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
                <h2 className="text-xl font-semibold">My Registrations</h2>
                <Card>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Certificate</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrations.map((reg) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">{reg.title}</TableCell>
                                    <TableCell>{reg.date}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            reg.status === 'ATTENDED' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-blue-500/10 text-blue-500 border-blue-500/20'
                                        }>
                                            {reg.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-2">
                                        {reg.status === 'ATTENDED' && (
                                            <FeedbackDialog eventTitle={reg.title} />
                                        )}
                                        {reg.certificate ? (
                                            <Button size="sm" variant="outline" className="border-primary/20 hover:bg-primary/10 hover:text-primary">
                                                <Download className="h-4 w-4 mr-1" /> Download
                                            </Button>
                                        ) : (
                                            <span className="text-muted-foreground text-sm">-</span>
                                        )}
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
