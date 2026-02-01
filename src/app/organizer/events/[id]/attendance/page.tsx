"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Search, Save, Loader2 } from "lucide-react"

export default function AttendancePage() {
    const { id } = useParams()

    // Mock Registrations
    const [registrations, setRegistrations] = useState([
        { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "PRESENT" },
        { id: 2, name: "Bob Smith", email: "bob@example.com", status: "ABSENT" },
        { id: 3, name: "Charlie Davis", email: "charlie@example.com", status: "ABSENT" },
        { id: 4, name: "Diana Prince", email: "diana@example.com", status: "PRESENT" },
    ])

    const [loading, setLoading] = useState(false)

    const toggleAttendance = (regId: number) => {
        setRegistrations(prev => prev.map(reg =>
            reg.id === regId
                ? { ...reg, status: reg.status === "PRESENT" ? "ABSENT" : "PRESENT" }
                : reg
        ))
    }

    const handleSave = () => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            // Toast success
        }, 1000)
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
                    <p className="text-muted-foreground">Event ID: {id}</p>
                </div>
                <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Participants ({registrations.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input placeholder="Search participants..." className="pl-8" />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Mark Present</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrations.map((reg) => (
                                <TableRow key={reg.id}>
                                    <TableCell className="font-medium">{reg.name}</TableCell>
                                    <TableCell>{reg.email}</TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={
                                            reg.status === 'PRESENT' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                                                'bg-gray-500/10 text-gray-500 border-gray-500/20'
                                        }>
                                            {reg.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Switch
                                            checked={reg.status === "PRESENT"}
                                            onCheckedChange={() => toggleAttendance(reg.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
