"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { usePathname, useSearchParams } from "next/navigation"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

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

                {/* Mobile Navigation Trigger */}
                <div className="md:hidden flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon">
                                <Menu className="h-6 w-6" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="w-[80vw] sm:w-[350px]">
                            <div className="flex flex-col gap-6 mt-6">
                                <Link href="/" className="flex items-center space-x-2">
                                    <span className="text-xl font-bold">EventEdge</span>
                                </Link>
                                <nav className="flex flex-col gap-4">
                                    <Link href="/events" className="text-lg font-medium transition-colors hover:text-primary">
                                        Events
                                    </Link>
                                    <Link href="/how-it-works" className="text-lg font-medium transition-colors hover:text-primary">
                                        How it Works
                                    </Link>
                                </nav>
                                <div className="flex flex-col gap-2 mt-4">
                                    <Link href="/auth/role-selection?mode=login">
                                        <Button variant="outline" className="w-full justify-start">
                                            Log in
                                        </Button>
                                    </Link>
                                    <Link href="/auth/role-selection?mode=register">
                                        <Button className="w-full justify-start bg-primary text-primary-foreground">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </header>
    )
}
