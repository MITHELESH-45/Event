"use client"

import { DashboardLayout } from "@/components/layout/DashboardLayout"

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout role="organizer">{children}</DashboardLayout>
}
