'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function Header() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center justify-between px-4 md:px-8">
                {/* Left: Logo */}
                <div className="flex items-center gap-2">
                    <img src="/Icon.png" alt="Stave Logo" className="h-6 w-auto" />
                    <span className="text-xl font-bold tracking-tight">Stave.</span>
                </div>

                {/* Center: Nav */}
                <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                    <button onClick={() => scrollToSection('features')} className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Features
                    </button>
                    <button onClick={() => scrollToSection('waitlist')} className="transition-colors hover:text-foreground/80 text-foreground/60">
                        Waitlist
                    </button>
                </nav>

                {/* Right: Auth Buttons (Disabled) */}
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="cursor-not-allowed">
                                    <Button variant="outline" className="h-8 px-4 opacity-50 pointer-events-none">
                                        Sign In
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>🔒</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <div className="cursor-not-allowed">
                                    <Button className="h-8 px-4 opacity-50 pointer-events-none bg-black text-white hover:bg-black/90">
                                        Sign Up
                                    </Button>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>🔒</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>
        </header>
    );
}
