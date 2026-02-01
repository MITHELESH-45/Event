import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { LucideIcon } from "lucide-react"

interface RoleCardProps {
    role: string
    title: string
    description: string
    icon: LucideIcon
    selected: boolean
    onClick: () => void
}

export function RoleCard({ role, title, description, icon: Icon, selected, onClick }: RoleCardProps) {
    return (
        <Card
            className={cn(
                "cursor-pointer transition-all hover:scale-105 hover:border-primary/50",
                selected ? "border-primary ring-2 ring-primary/20 bg-primary/5" : "bg-card/50"
            )}
            onClick={onClick}
        >
            <CardContent className="flex flex-col items-center p-6 text-center space-y-4">
                <div className={cn("p-4 rounded-full bg-secondary/50", selected && "bg-primary/20 text-primary")}>
                    <Icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                    <h3 className="font-semibold text-lg">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </CardContent>
        </Card>
    )
}
