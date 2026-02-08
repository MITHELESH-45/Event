"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, CheckSquare, Award, Download, Loader2 } from "lucide-react"
import { FeedbackDialog } from "@/components/feedback/FeedbackDialog"
import { useRouter } from "next/navigation"
import { format } from "date-fns"

import { generateCertificate } from "@/lib/certificate"
import { useToast } from "@/components/ui/use-toast"

export default function UserDashboard() {
    const router = useRouter()
    const { toast } = useToast()
    const [registrations, setRegistrations] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [downloading, setDownloading] = useState<string | null>(null)

    const handleDownloadCertificate = async (regId: string, userName: string, eventName: string, date: string) => {
        setDownloading(regId)
        try {
            const formattedDate = format(new Date(date), 'MMMM dd, yyyy')
            const pdfBytes = await generateCertificate(userName, eventName, formattedDate)

            if (pdfBytes) {
                const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
                const link = document.createElement("a")
                link.href = window.URL.createObjectURL(blob)
                link.download = `${eventName.replace(/\s+/g, '_')}_Certificate.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(link.href)

                toast({
                    title: "Success",
                    description: "Certificate downloaded successfully!"
                })
            } else {
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to generate certificate"
                })
            }
        } catch (error) {
            console.error("Certificate download failed", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to download certificate"
            })
        } finally {
            setDownloading(null)
        }
    }

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/auth/login')
                    return
                }

                const res = await fetch('http://localhost:5000/api/registrations/my', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()
                    setRegistrations(data)
                }
            } catch (error) {
                console.error("Failed to fetch registrations", error)
            } finally {
                setLoading(false)
            }
        }

        fetchRegistrations()
    }, [router])

    const stats = [
        { title: "Registered Events", value: registrations.length.toString(), icon: Calendar, description: "Upcoming & Past" },
        { title: "Events Attended", value: registrations.filter(r => r.status === 'attended').length.toString(), icon: CheckSquare, description: "Confirmed presence" },
        { title: "Certificates Earned", value: registrations.filter(r => r.status === 'attended').length.toString(), icon: Award, description: "Available for download" },
    ]

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        )
    }

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
                            {registrations.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">No registrations found</TableCell>
                                </TableRow>
                            ) : (
                                registrations.map((reg) => (
                                    <TableRow key={reg._id}>
                                        <TableCell className="font-medium">{reg.event?.title || 'Unknown Event'}</TableCell>
                                        <TableCell>{reg.event?.date ? format(new Date(reg.event.date), 'yyyy-MM-dd') : 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={
                                                reg.status === 'attended' ? 'bg-primary/10 text-primary border-primary/20' :
                                                    'bg-secondary/50 text-secondary-foreground border-secondary'
                                            }>
                                                {reg.status.charAt(0).toUpperCase() + reg.status.slice(1)}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right flex items-center justify-end gap-2">
                                            {reg.status === 'attended' && (
                                                <>
                                                    <FeedbackDialog eventTitle={reg.event?.title} />
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleDownloadCertificate(
                                                            reg._id,
                                                            reg.user?.name || "Participant",
                                                            reg.event?.title || "Event",
                                                            reg.event?.date || new Date().toISOString()
                                                        )}
                                                        disabled={downloading === reg._id}
                                                    >
                                                        {downloading === reg._id ? (
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                                        ) : (
                                                            <Download className="h-4 w-4 mr-2" />
                                                        )}
                                                        Certificate
                                                    </Button>
                                                </>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </Card>
            </div>
        </div>
    )
}
