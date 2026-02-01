export function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container py-8 md:py-12">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-foreground/60">
                        © {new Date().getFullYear()} EventEdge. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                            Privacy Policy
                        </a>
                        <a href="#" className="text-sm text-foreground/60 hover:text-foreground transition-colors">
                            Terms of Service
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
