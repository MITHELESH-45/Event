import { LayoutDashboard, Calendar, Users, FileCheck, PlusCircle, Award, BarChart3 } from "lucide-react"

export type NavItem = {
    title: string
    href: string
    icon: any
}

export const navConfig = {
    admin: [
        {
            title: "Dashboard",
            href: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Approvals",
            href: "/admin/approvals",
            icon: FileCheck,
        },
        {
            title: "Analytics",
            href: "/admin/analytics",
            icon: BarChart3,
        },
    ],
    organizer: [
        {
            title: "Dashboard",
            href: "/organizer/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "My Events",
            href: "/organizer/events",
            icon: Calendar,
        },
        {
            title: "Create Event",
            href: "/organizer/events/create",
            icon: PlusCircle,
        },
    ],
    user: [
        {
            title: "Dashboard",
            href: "/user/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "Browse Events",
            href: "/user/events",
            icon: Calendar,
        },
        {
            title: "My Registrations",
            href: "/user/registrations",
            icon: FileCheck,
        },
        {
            title: "Certificates",
            href: "/user/certificates",
            icon: Award,
        },
    ],
}
