"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Star, MessageSquare } from "lucide-react"

export function FeedbackDialog({ eventTitle }: { eventTitle: string }) {
    const [open, setOpen] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [submitted, setSubmitted] = useState(false)

    const handleSubmit = () => {
        // Mock API
        setTimeout(() => {
            setSubmitted(true)
            setTimeout(() => setOpen(false), 1500)
        }, 500)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="ghost" disabled={submitted} className="text-primary hover:text-primary/80">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    {submitted ? "Feedback Sent" : "Give Feedback"}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Feedback for {eventTitle}</DialogTitle>
                    <DialogDescription>
                        Rate your experience and let us know how we can improve.
                    </DialogDescription>
                </DialogHeader>
                {!submitted ? (
                    <div className="grid gap-4 py-4">
                        <div className="flex justify-center gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    className={`h-8 w-8 cursor-pointer transition-colors ${rating >= star ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="comment">Comments</Label>
                            <Textarea
                                id="comment"
                                placeholder="The session was..."
                                value={comment}
                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="py-8 text-center text-primary">
                        <p className="text-lg font-medium">Thank you for your feedback!</p>
                    </div>
                )}
                {!submitted && (
                    <DialogFooter>
                        <Button onClick={handleSubmit} disabled={rating === 0}>Submit Feedback</Button>
                    </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
    )
}
