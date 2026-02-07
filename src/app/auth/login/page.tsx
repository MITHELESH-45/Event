"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { Loader2, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const role = searchParams.get("role")
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    useEffect(() => {
        if (!role) {
            router.push("/auth/role-selection")
        }
    }, [role, router])

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, role }),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error("Failed")
                return res.json()
            })
            .then((data) => {
                if (data?.user) {
                    try {
                        localStorage.setItem("currentUser", JSON.stringify(data.user))
                    } catch { }
                }
                if (data?.token) {
                    localStorage.setItem("token", data.token)
                }
                setLoading(false)
                if (role === "admin") router.push("/admin/dashboard")
                else if (role === "organizer") router.push("/organizer/dashboard")
                else if (role === "user") router.push("/user/dashboard")
            })
            .catch(() => {
                setLoading(false)
            })
    }

    if (!role) return null

    return (
        <PublicLayout>
            <div className="container flex items-center justify-center min-h-[calc(100vh-140px)] py-12">
                <Card className="w-full max-w-md border-primary/20 shadow-lg shadow-primary/5">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Login as {role.charAt(0).toUpperCase() + role.slice(1)}</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your dashboard
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleLogin}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full" disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Don&apos;t have an account?{" "}
                                <Link href={`/auth/register?role=${role}`} className="text-primary hover:underline">
                                    Sign up
                                </Link>
                            </div>
                            <div className="text-center text-xs">
                                <Link href="/auth/role-selection" className="text-muted-foreground hover:text-foreground">
                                    Switch Role
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </PublicLayout>
    )
}
