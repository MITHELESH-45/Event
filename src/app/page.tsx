"use client"

import { PublicLayout } from "@/components/layout/PublicLayout"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, Calendar, CheckCircle, ShieldCheck } from "lucide-react"

export default function LandingPage() {
  return (
    <PublicLayout>
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent mb-6">
            Manage Institutional Events <br /> With Ease & Efficiency
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10">
            A complete platform for automating event creation, registration, attendance, and certification for educational institutions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/role-selection?mode=register">
              <Button size="lg" className="h-12 px-8 text-lg shadow-xl shadow-primary/20">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>

          </div>
        </div>
        {/* Abstract BG element */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[120px] -z-0 pointer-events-none" />
      </section>

      <section className="py-20 bg-card/30 border-y border-white/5">
        <div className="container grid md:grid-cols-3 gap-12">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <Calendar className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Smart Scheduling</h3>
            <p className="text-muted-foreground">Effortlessly create and schedule online or offline events with capacity controls.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <ShieldCheck className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Role-Based Access</h3>
            <p className="text-muted-foreground">Secure governance with dedicated dashboards for Admins, Organizers, and Participants.</p>
          </div>
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-4 rounded-full bg-primary/10 text-primary">
              <CheckCircle className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-bold">Digital Certificates</h3>
            <p className="text-muted-foreground">Auto-generate and distribute secure, verifiable certificates to attendees.</p>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}