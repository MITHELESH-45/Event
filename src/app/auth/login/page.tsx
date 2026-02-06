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
    const [showPassword, setShowPassword] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    useEffect(() => {
        if (!role) {
            router.push("/auth/role-selection")
        }
    }, [role, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (res.ok) {
                // Store token and user info
                localStorage.setItem('token', data.token)
                localStorage.setItem('user', JSON.stringify(data))

                // Check if role matches
                if (data.role !== role && role !== 'admin') { // Admin can login as anyone? No.
                    // Actually, if role doesn't match, we should warn?
                    // But backend returns role.
                    // If user tries to login as organizer but is user in DB.
                    if (data.role !== role) {
                        alert(`You are logged in as ${data.role}, but tried to access ${role} portal. Redirecting to ${data.role} dashboard.`)
                    }
                }

                // Redirect based on returned role
                if (data.role === "admin") router.push("/admin/dashboard")
                else if (data.role === "organizer") router.push("/organizer/dashboard")
                else if (data.role === "user") router.push("/user/dashboard")
            } else {
                alert(data.message || "Login failed")
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
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
                                <Input id="email" type="email" placeholder="name@example.com" required value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="password">Password</Label>
                                    <Link href="#" className="text-sm text-primary hover:underline">
                                        Forgot password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Input 
                                        id="password" 
                                        type={showPassword ? "text" : "password"} 
                                        required 
                                        value={formData.password} 
                                        onChange={handleChange} 
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4 text-muted-foreground" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-muted-foreground" />
                                        )}
                                        <span className="sr-only">Toggle password visibility</span>
                                    </Button>
                                </div>
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
