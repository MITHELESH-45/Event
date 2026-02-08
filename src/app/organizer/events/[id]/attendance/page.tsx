"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Search, Save, Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

interface Registration {
    _id: string
    user: {
        _id: string
        name: string
        email: string
    }
    status: string
    createdAt: string
}

export default function AttendancePage() {
    const { id } = useParams()
    const router = useRouter()
    const { toast } = useToast()
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/auth/login?role=organizer')
                    return
                }

                const res = await fetch(`http://localhost:5000/api/registrations/event/${id}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()
                    setRegistrations(data)
                } else {
                    console.error("Failed to fetch registrations")
                }
            } catch (error) {
                console.error("Error fetching registrations:", error)
            } finally {
                setLoading(false)
            }
        }

        if (id) {
            fetchRegistrations()
        }
    }, [id, router])

    const toggleAttendance = async (regId: string, currentStatus: string) => {
        const newStatus = currentStatus === "attended" ? "confirmed" : "attended"

        try {
            const token = localStorage.getItem('token')
            if (!token) return

            const res = await fetch(`http://localhost:5000/api/registrations/${regId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    status: newStatus,
                    certificate: newStatus === 'attended'
                })
            })

            if (res.ok) {
                // Optimistic update
                setRegistrations(prev => prev.map(reg =>
                    reg._id === regId ? { ...reg, status: newStatus } : reg
                ))
                toast({
                    title: "Success",
                    description: `Marked as ${newStatus === 'attended' ? 'present' : 'absent'}`
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to update attendance"
                })
            }
        } catch (error) {
            console.error("Error updating attendance:", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to update attendance"
            })
        }
    }

    const filteredRegistrations = registrations.filter(reg =>
        reg.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reg.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={`/organizer/events/${id}/manage`}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Attendance Management</h1>
                        <p className="text-muted-foreground">Event ID: {id}</p>
                    </div>
                </div>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <CardTitle>Participants ({registrations.length})</CardTitle>
                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search participants..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
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
                            {filteredRegistrations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                                        No registrations found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredRegistrations.map((reg) => (
                                    <TableRow key={reg._id}>
                                        <TableCell className="font-medium">{reg.user?.name || 'Unknown'}</TableCell>
                                        <TableCell>{reg.user?.email || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                reg.status === 'attended' ? 'bg-primary/10 text-primary border-primary/20' :
                                                    'bg-muted/10 text-muted-foreground border-muted/20'
                                            }>
                                                {reg.status === 'attended' ? 'PRESENT' : 'ABSENT'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Switch
                                                checked={reg.status === "attended"}
                                                onCheckedChange={() => toggleAttendance(reg._id, reg.status)}
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    )
}
