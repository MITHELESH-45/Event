"use client"

import { MobileSidebar } from "./MobileSidebar"
import { UserNav } from "./UserNav"

interface DashboardHeaderProps {
    role: "admin" | "organizer" | "user"
}

export function DashboardHeader({ role }: DashboardHeaderProps) {
    return (
        <header className="sticky top-0 z-50 flex h-14 items-center gap-4 border-b bg-background/95 backdrop-blur px-6 lg:h-[60px]">
            <MobileSidebar role={role} />
            <div className="w-full flex-1">
                {/* Breadcrumb or Search could go here */}
            </div>
            <UserNav />
        </header>
    )
}
