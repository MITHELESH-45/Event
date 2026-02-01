"use client"

import Link from "next/link"
import { PublicLayout } from "@/components/layout/PublicLayout"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Users, Award, ArrowRight, Sparkles, Shield, Zap } from "lucide-react"

export default function Home() {
  const features = [
    {
      icon: Calendar,
      title: "Easy Event Creation",
      description: "Create and manage events effortlessly with our intuitive interface."
    },
    {
      icon: Users,
      title: "Seamless Registration",
      description: "Streamlined registration process for attendees with instant confirmation."
    },
    {
      icon: Award,
      title: "Automatic Certificates",
      description: "Generate and distribute certificates automatically after event completion."
    },
    {
      icon: Shield,
      title: "Admin Approval",
      description: "Quality control with admin approval workflow for all events."
    },
    {
      icon: Zap,
      title: "Real-time Analytics",
      description: "Track registrations, attendance, and engagement in real-time."
    },
    {
      icon: Sparkles,
      title: "Attendance Tracking",
      description: "Mark attendance easily and keep accurate records for all events."
    }
  ]

  const stats = [
    { value: "500+", label: "Events Hosted" },
    { value: "10K+", label: "Registrations" },
    { value: "95%", label: "Satisfaction Rate" },
    { value: "50+", label: "Organizations" }
  ]

  return (
    <PublicLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

        <div className="container relative py-20 md:py-32">
          <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
            <Badge className="mb-6 px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Streamlined Event Management
            </Badge>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
              <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text text-transparent">
                Manage Events
              </span>
              <br />
              <span className="bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                Like Never Before
              </span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-8">
              Create, manage, and track college events with ease. From registration to certificates,
              EventEdge handles everything so you can focus on what matters.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/auth/role-selection?mode=register">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-8">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-y bg-card/30">
        <div className="container py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-28">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">Features</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything you need to run events
            </h2>
            <p className="text-muted-foreground">
              Powerful tools designed for organizers, admins, and attendees alike.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="bg-card/50 border-border/50 hover:border-primary/30 transition-colors group">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 border-t">
        <div className="container">
          <div className="relative rounded-2xl bg-gradient-to-r from-primary/20 via-primary/10 to-blue-500/20 p-8 md:p-16 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

            <div className="relative text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Ready to get started?
              </h2>
              <p className="text-muted-foreground mb-8">
                Join thousands of organizers who trust EventEdge for their event management needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/role-selection?mode=register">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/25 px-8">
                    Create Your First Event
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}