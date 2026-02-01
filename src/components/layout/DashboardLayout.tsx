import { Sidebar } from "./Sidebar"
import { DashboardHeader } from "./DashboardHeader"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

interface DashboardLayoutProps {
    children: React.ReactNode
    role: "admin" | "organizer" | "user"
}

export function DashboardLayout({ children, role }: DashboardLayoutProps) {
    return (
        <div className="flex h-screen overflow-hidden">
            {/* Desktop Sidebar */}
            <Sidebar role={role} className="hidden md:block border-r h-screen fixed left-0 top-0" />

            <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300 w-full">
                {/* Mobile Header with Sidebar Trigger */}
                <div className="md:hidden flex items-center p-4 border-b bg-background">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="mr-4">
                                <Menu className="h-6 w-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="p-0 w-64">
                            <Sidebar role={role} className="w-full h-full" />
                        </SheetContent>
                    </Sheet>
                    <div className="font-semibold text-lg">EventEdge</div>
                </div>

                {/* Dashboard Header (Desktop & Mobile content header) */}
                <div className="hidden md:block">
                    <DashboardHeader role={role} />
                </div>

                <main className="flex-1 overflow-y-auto p-4 md:p-6 bg-background/50">
                    {children}
                </main>
            </div>
        </div>
    )
}
