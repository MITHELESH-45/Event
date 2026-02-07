"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Upload, CheckCircle2, ChevronRight, ChevronLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"



const steps = [
    { id: 1, title: "Basic Details" },
    { id: 2, title: "Schedule" },
    { id: 3, title: "Capacity" },
    { id: 4, title: "Media & Certs" },
]

export default function CreateEventPage() {
    const router = useRouter()
    // const { toast } = useToast() // Toast hook needs provider, assuming Toaster is added in layout
    const [currentStep, setCurrentStep] = useState(1)
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "workshop",
        startDate: new Date(),
        startTime: "10:00",
        endTime: "12:00",
        mode: "offline",
        location: "",
        capacity: 100,
        certificateEnabled: true,
        certificateTitle: "Certificate of Participation",
    })

    // Basic handlers
    const handleNext = () => setCurrentStep((prev) => Math.min(prev + 1, 4))
    const handlePrev = () => setCurrentStep((prev) => Math.max(prev - 1, 1))

    const handleSubmit = async () => {
        setLoading(true)
        
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert("You are not logged in");
                router.push("/auth/login?role=organizer");
                return;
            }

            const res = await fetch('http://localhost:5000/api/events', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    title: formData.title,
                    description: formData.description,
                    date: formData.startDate,
                    time: `${formData.startTime} - ${formData.endTime}`,
                    location: formData.location,
                    capacity: formData.capacity,
                    category: formData.type,
                    status: 'published'
                })
            });

            if (res.ok) {
                 alert("Event created successfully!");
                 router.push("/organizer/dashboard");
            } else {
                 const data = await res.json();
                 alert(data.message || "Failed to create event");
            }
        } catch (error) {
            console.error(error);
            alert("Error creating event");
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-3xl mx-auto space-y-8 pb-12">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Create New Event</h1>
            </div>

            {/* Progress Steps */}
            <div className="relative flex justify-between">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex flex-col items-center relative z-10">
                        <div className={cn(
                            "w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2",
                            currentStep >= step.id
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-background border-muted text-muted-foreground"
                        )}>
                            {currentStep > step.id ? <CheckCircle2 className="h-6 w-6" /> : step.id}
                        </div>
                        <span className={cn(
                            "text-xs mt-2 font-medium absolute -bottom-6 w-32 text-center",
                            currentStep >= step.id ? "text-primary" : "text-muted-foreground"
                        )}>
                            {step.title}
                        </span>
                    </div>
                ))}
                {/* Progress Line */}
                <div className="absolute top-5 left-0 w-full h-[2px] bg-muted -z-0">
                    <div
                        className="h-full bg-primary transition-all duration-300"
                        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />
                </div>
            </div>

            <Card className="mt-8 border-primary/10 shadow-lg">
                <CardContent className="p-8">

                    {/* STEP 1: Basic Details */}
                    {currentStep === 1 && (
                        <div className="space-y-6 animate-accordion-down">
                            <div className="space-y-2">
                                <Label htmlFor="title">Event Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g. Annual Tech Summit 2024"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="type">Event Type</Label>
                                <Select
                                    value={formData.type}
                                    onValueChange={(val) => setFormData({ ...formData, type: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="workshop">Workshop</SelectItem>
                                        <SelectItem value="seminar">Seminar</SelectItem>
                                        <SelectItem value="webinar">Webinar</SelectItem>
                                        <SelectItem value="conference">Conference</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="desc">Description</Label>
                                <Textarea
                                    id="desc"
                                    placeholder="Describe your event..."
                                    className="min-h-[120px]"
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 2: Schedule */}
                    {currentStep === 2 && (
                        <div className="space-y-6 animate-accordion-down">
                            <div className="space-y-2">
                                <Label>Event Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                                !formData.startDate && "text-muted-foreground"
                                            )}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.startDate}
                                            onSelect={(date) => date && setFormData({ ...formData, startDate: date })}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="start">Start Time</Label>
                                    <Input
                                        id="start" type="time"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="end">End Time</Label>
                                    <Input
                                        id="end" type="time"
                                        value={formData.endTime}
                                        onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Mode</Label>
                                <div className="flex gap-4">
                                    <Button
                                        variant={formData.mode === 'offline' ? 'default' : 'outline'}
                                        onClick={() => setFormData({ ...formData, mode: 'offline' })}
                                        className="w-1/2"
                                    >
                                        Offline (Venue)
                                    </Button>
                                    <Button
                                        variant={formData.mode === 'online' ? 'default' : 'outline'}
                                        onClick={() => setFormData({ ...formData, mode: 'online' })}
                                        className="w-1/2"
                                    >
                                        Online (Link)
                                    </Button>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="location">{formData.mode === 'offline' ? 'Venue Address' : 'Meeting Link'}</Label>
                                <Input
                                    id="location"
                                    placeholder={formData.mode === 'offline' ? 'e.g. Auditorium A, Block 3' : 'e.g. https://meet.google.com/...'}
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                />
                            </div>
                        </div>
                    )}

                    {/* STEP 3: Capacity */}
                    {currentStep === 3 && (
                        <div className="space-y-6 animate-accordion-down">
                            <div className="space-y-4">
                                <Label>Maximum Participants</Label>
                                <div className="flex items-center gap-4">
                                    <Input
                                        type="number"
                                        className="text-2xl h-16 w-32 text-center"
                                        value={formData.capacity}
                                        onChange={(e) => setFormData({ ...formData, capacity: parseInt(e.target.value) })}
                                    />
                                    <p className="text-muted-foreground text-sm">
                                        Attendees. Once this limit is reached, registration will automatically close.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 4: Media & Certs */}
                    {currentStep === 4 && (
                        <div className="space-y-6 animate-accordion-down">

                            <div className="space-y-4 rounded-lg border p-4">
                                <div className="flex flex-col space-y-1.5 p-0">
                                    <Label className="text-base">Event Banner</Label>
                                    <p className="text-sm text-muted-foreground">Upload a cover image for your event page.</p>
                                </div>
                                <div className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-md hover:bg-muted/50 transition cursor-pointer">
                                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                                        <Upload className="h-8 w-8" />
                                        <span>Click to upload image</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <Label className="text-base">Issue Certificate</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Automatically generate certificates for attendees.
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.certificateEnabled}
                                    onCheckedChange={(checked) => setFormData({ ...formData, certificateEnabled: checked })}
                                />
                            </div>

                            {formData.certificateEnabled && (
                                <div className="space-y-2 animate-accordion-down">
                                    <Label htmlFor="cert-title">Certificate Title</Label>
                                    <Input
                                        id="cert-title"
                                        value={formData.certificateTitle}
                                        onChange={(e) => setFormData({ ...formData, certificateTitle: e.target.value })}
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between mt-8 pt-4 border-t">
                        <Button
                            variant="ghost"
                            onClick={handlePrev}
                            disabled={currentStep === 1}
                        >
                            <ChevronLeft className="mr-2 h-4 w-4" /> Back
                        </Button>

                        {currentStep < 4 ? (
                            <Button onClick={handleNext}>
                                Next <ChevronRight className="ml-2 h-4 w-4" />
                            </Button>
                        ) : (
                            <Button onClick={handleSubmit} disabled={loading} className="w-32 bg-primary hover:bg-primary/90 text-primary-foreground">
                                {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Publish Event"}
                            </Button>
                        )}
                    </div>

                </CardContent>
            </Card>
        </div>
    )
}
