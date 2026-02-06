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

export default function RegisterPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const role = searchParams.get("role")
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    useEffect(() => {
        if (!role) {
            router.push("/auth/role-selection?mode=register")
        } else if (role === 'admin') {
            router.push("/auth/login?role=admin") // Admin cannot register
        }
    }, [role, router])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (formData.password !== formData.confirmPassword) {
            alert("Passwords do not match")
            return
        }

        setLoading(true)

        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: role
                })
            })

            const data = await res.json()

            if (res.ok) {
                alert("Registration successful! Please login.")
                router.push(`/auth/login?role=${role}`)
            } else {
                alert(data.message || "Registration failed")
            }
        } catch (error) {
            console.error(error)
            alert("An error occurred. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    if (!role || role === 'admin') return null

    return (
        <PublicLayout>
            <div className="container flex items-center justify-center min-h-[calc(100vh-140px)] py-12">
                <Card className="w-full max-w-md border-primary/20 shadow-lg shadow-primary/5">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Create {role.charAt(0).toUpperCase() + role.slice(1)} Account</CardTitle>
                        <CardDescription>
                            Enter your details to create an account
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleRegister}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input id="name" placeholder="John Doe" required value={formData.name} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="name@example.com" required value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
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
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <div className="relative">
                                    <Input 
                                        id="confirmPassword" 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        required 
                                        value={formData.confirmPassword} 
                                        onChange={handleChange} 
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    >
                                        {showConfirmPassword ? (
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
                                Sign Up
                            </Button>
                            <div className="text-center text-sm text-muted-foreground">
                                Already have an account?{" "}
                                <Link href={`/auth/login?role=${role}`} className="text-primary hover:underline">
                                    Sign in
                                </Link>
                            </div>
                            <div className="text-center text-xs">
                                <Link href="/auth/role-selection?mode=register" className="text-muted-foreground hover:text-foreground">
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
