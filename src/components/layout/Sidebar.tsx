"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { navConfig } from "@/config/nav"
import { LogOut } from "lucide-react"

interface SidebarProps {
    role: "admin" | "organizer" | "user"
    className?: string
}

export function Sidebar({ role, className }: SidebarProps) {
    const pathname = usePathname()
    const items = navConfig[role]

    return (
        <div className={cn("pb-12 w-64 bg-card h-full overflow-y-auto", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
                        EventEdge
                    </h2>
                    <div className="space-y-1">
                        {items.map((item) => (
                            <Link key={item.href} href={item.href}>
                                <Button
                                    variant={pathname === item.href ? "secondary" : "ghost"}
                                    className="w-full justify-start"
                                >
                                    <item.icon className="mr-2 h-4 w-4" />
                                    {item.title}
                                </Button>
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="absolute bottom-4 left-0 w-full px-4">
                    <Link href="/">
                        <Button variant="outline" className="w-full justify-start text-muted-foreground">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    )
}
