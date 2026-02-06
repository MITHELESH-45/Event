"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Award, Download, Loader2 } from "lucide-react"
import { generateCertificate } from "@/lib/certificate"

export default function CertificatesPage() {
    const [generating, setGenerating] = useState<number | null>(null)

    const certificates = [
        {
            id: 1,
            eventName: "React Performance Summit",
            date: "2024-02-10",
            issuer: "Tech Institute",
        },
        {
            id: 2,
            eventName: "Node.js Basics Workshop",
            date: "2024-01-15",
            issuer: "Dev Community",
        },
    ]

    const handleDownload = async (cert: typeof certificates[0]) => {
        setGenerating(cert.id)
        try {
            // Generate PDF
            const pdfBytes = await generateCertificate("User Name", cert.eventName, cert.date)

            if (pdfBytes) {
                // Create Blob and Download
                const blob = new Blob([pdfBytes as any], { type: "application/pdf" })
                const url = window.URL.createObjectURL(blob)
                const link = document.createElement("a")
                link.href = url
                link.download = `${cert.eventName.replace(/\s+/g, '_')}_Certificate.pdf`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
            }
        } catch (error) {
            console.error("Failed to generate certificate", error)
        } finally {
            setGenerating(null)
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">My Certificates</h1>
                <p className="text-muted-foreground">Download your earned certificates.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {certificates.map((cert) => (
                    <Card key={cert.id} className="relative overflow-hidden border-primary/20">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                            <Award className="h-24 w-24" />
                        </div>
                        <CardHeader>
                            <CardTitle className="leading-snug">{cert.eventName}</CardTitle>
                            <CardDescription>Issued by {cert.issuer}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col gap-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-muted-foreground">Date:</span>
                                    <span className="font-medium">{cert.date}</span>
                                </div>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-muted-foreground">Status:</span>
                                    <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Verified</Badge>
                                </div>
                                <Button
                                    className="w-full mt-2"
                                    variant="outline"
                                    onClick={() => handleDownload(cert)}
                                    disabled={generating === cert.id}
                                >
                                    {generating === cert.id ? (
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    ) : (
                                        <Download className="mr-2 h-4 w-4" />
                                    )}
                                    Download PDF
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
