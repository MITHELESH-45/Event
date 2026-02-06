"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { RoleCard } from "@/components/auth/RoleCard"
import { Button } from "@/components/ui/button"
import { ShieldCheck, Calendar, Users } from "lucide-react"
import { PublicLayout } from "@/components/layout/PublicLayout"

export default function RoleSelectionPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const mode = searchParams.get("mode") || "login" // login or register
    const [selectedRole, setSelectedRole] = useState<string | null>(null)

    const roles = [
        {
            id: "admin",
            title: "Admin",
            description: "Manage system analytics and approve events.",
            icon: ShieldCheck,
            disabled: mode === "register", // Admin cannot register publicly
        },
        {
            id: "organizer",
            title: "Organizer",
            description: "Create events, manage attendees, and publish certificates.",
            icon: Calendar,
        },
        {
            id: "user",
            title: "Participant",
            description: "Register for events, track attendance, and download certificates.",
            icon: Users,
        },
    ]

    const handleContinue = () => {
        if (!selectedRole) return
        router.push(`/auth/${mode}?role=${selectedRole}`)
    }

    return (
        <PublicLayout>
            <div className="container flex flex-col items-center justify-center min-h-[calc(100vh-140px)] py-8">
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="text-center space-y-4 mb-12">
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl bg-gradient-to-r from-primary via-yellow-500 to-red-500 bg-clip-text text-transparent">
                            Select Your Role
                        </h1>
                        <p className="text-muted-foreground text-lg max-w-lg mx-auto">
                            Choose how you want to interact with the Event Management System.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-12">
                        {roles.map((role) => (
                            !role.disabled && (
                                <RoleCard
                                    key={role.id}
                                    role={role.id}
                                    title={role.title}
                                    description={role.description}
                                    icon={role.icon}
                                    selected={selectedRole === role.id}
                                    onClick={() => setSelectedRole(role.id)}
                                />
                            )
                        ))}
                    </div>

                    <Button
                        size="lg"
                        className="w-full max-w-sm"
                        disabled={!selectedRole}
                        onClick={handleContinue}
                    >
                        Continue to {mode === "login" ? "Login" : "Registration"}
                    </Button>
                </div>
            </div>
        </PublicLayout>
    )
}
