"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname, useSearchParams } from "next/navigation"

export function Navbar() {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const isAuthPage = pathname.startsWith("/auth")
    const mode = searchParams.get("mode")

    // Simplified header for auth pages
    if (isAuthPage) {
        return (
            <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <Link href="/" className="flex items-center space-x-2">
                        <Image src="/logo.png" alt="EventEdge Logo" width={32} height={32} />
                        <span className="text-xl font-bold bg-gradient-to-r from-primary via-yellow-500 to-red-500 bg-clip-text text-transparent">
                            EventEdge
                        </span>
                    </Link>

                    <div className="flex items-center space-x-4">
                        {mode === "register" ? (
                            <Link href="/auth/role-selection?mode=login">
                                <Button variant="ghost" size="sm">
                                    Log in
                                </Button>
                            </Link>
                        ) : (
                            <Link href="/auth/role-selection?mode=register">
                                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                                    Get Started
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        )
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                    <Image src="/logo.png" alt="EventEdge Logo" width={32} height={32} />
                    <span className="text-xl font-bold bg-gradient-to-r from-primary via-yellow-500 to-red-500 bg-clip-text text-transparent">
                        EventEdge
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
                    <Link href="/events" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Events
                    </Link>
                    <Link href="/how-it-works" className="transition-colors hover:text-foreground/80 text-foreground/60">
                        How it Works
                    </Link>
                </nav>

                {/* Desktop Auth Buttons */}
                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/auth/role-selection?mode=login">
                        <Button variant="ghost" size="sm">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/auth/role-selection?mode=register">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                            Get Started
                        </Button>
                    </Link>
                </div>

                {/* Mobile Auth Buttons */}
                <div className="md:hidden flex items-center space-x-2">
                    <Link href="/auth/role-selection?mode=login">
                        <Button variant="ghost" size="sm">
                            Log in
                        </Button>
                    </Link>
                    <Link href="/auth/role-selection?mode=register">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20">
                            Get Started
                        </Button>
                    </Link>
                </div>
            </div>
        </header>
    )
}
