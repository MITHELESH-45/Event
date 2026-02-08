"use client"

import { useState, useEffect } from "react"
import { API_URL } from "@/lib/api"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Loader2, Eye } from "lucide-react"
import { generateCertificate } from "@/lib/certificate"
import { format } from "date-fns"
import { useToast } from "@/components/ui/use-toast"

interface Registration {
    _id: string
    event: {
        _id: string
        title: string
        date: string
        organizer: {
            name: string
        }
    }
    user: {
        _id: string
        name: string
        email: string
    }
    status: string
    createdAt: string
}

export default function CertificatesPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [generating, setGenerating] = useState<string | null>(null)
    const [registrations, setRegistrations] = useState<Registration[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const token = localStorage.getItem('token')
                if (!token) {
                    router.push('/auth/login')
                    return
                }

                const res = await fetch(`${API_URL}/api/registrations/my`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                })

                if (res.ok) {
                    const data = await res.json()
                    // Filter only attended events (eligible for certificates)
                    const attendedEvents = data.filter((reg: Registration) => reg.status === 'attended')
                    setRegistrations(attendedEvents)
                } else {
                    console.error("Failed to fetch registrations")
                }
            } catch (error) {
                console.error("Error fetching certificates:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchCertificates()
    }, [router])

    const handleDownload = async (reg: Registration) => {
        setGenerating(reg._id)
        try {
            const userName = reg.user?.name || "Participant"
            const eventName = reg.event?.title || "Event"
            const eventDate = reg.event?.date ? format(new Date(reg.event.date), 'MMMM dd, yyyy') : 'Date'

            // Generate PDF with actual user and event data
            const pdfBytes = await generateCertificate(userName, eventName, eventDate)

            if (pdfBytes) {
                // Create Blob and Download
                const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `${eventName.replace(/\s+/g, '_')}_Certificate.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                window.URL.revokeObjectURL(url)

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
            console.error("Failed to generate certificate", error)
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to download certificate"
            })
        } finally {
            setGenerating(null)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[50vh]">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
                <p className="text-muted-foreground">Download your earned certificates.</p>
            </div>

            {registrations.length === 0 ? (
                <Card className="p-12">
                    <div className="text-center">
                        <Award className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium mb-2">No Certificates Yet</h3>
                        <p className="text-muted-foreground">
                            Attend events to earn certificates that you can download here.
                        </p>
                    </div>
                </Card>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {registrations.map((reg) => (
                        <Card key={reg._id} className="relative overflow-hidden border-primary/20">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <Award className="h-24 w-24" />
                            </div>
                            <CardHeader>
                                <CardTitle className="leading-snug">{reg.event?.title || 'Event'}</CardTitle>
                                <CardDescription>Issued by {reg.event?.organizer?.name || 'Organizer'}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col gap-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Date:</span>
                                        <span className="font-medium">
                                            {reg.event?.date ? format(new Date(reg.event.date), 'MMM dd, yyyy') : 'N/A'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Recipient:</span>
                                        <span className="font-medium">{reg.user?.name || 'You'}</span>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-muted-foreground">Status:</span>
                                        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Verified</Badge>
                                    </div>
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            asChild
                                            title="View event"
                                        >
                                            <Link href={`/user/events/${reg.event?._id}`}>
                                                <Eye className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                        <Button
                                            className="flex-1"
                                            variant="outline"
                                            onClick={() => handleDownload(reg)}
                                            disabled={generating === reg._id}
                                        >
                                            {generating === reg._id ? (
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            ) : (
                                                <Download className="mr-2 h-4 w-4" />
                                            )}
                                            Download PDF
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    )
}
