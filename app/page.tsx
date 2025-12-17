import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { BentoGrid } from '@/components/landing/bento-grid';
import { WaitlistForm } from '@/components/landing/waitlist-form';
import { AnimatedGradientBackground } from '@/components/landing/AnimatedGradientBackground';

export default function LandingPage() {
    return (
        <div className="relative flex min-h-screen flex-col bg-white overflow-hidden selection:bg-blue-100">
            <AnimatedGradientBackground />

            <Header />

            <main className="flex-1 relative z-10 w-full">
                <Hero />
                <BentoGrid />
                <WaitlistForm />
            </main>

            {/* Simple Footer */}
            <footer className="relative z-10 py-6 text-center text-sm text-gray-500 bg-white/50 backdrop-blur-sm border-t border-gray-100">
                <p>© {new Date().getFullYear()} Stave. All rights reserved. <span className="mx-2 text-gray-300">|</span> <a href="mailto:hello@stave.so" className="hover:text-gray-700 transition-colors">📧 hello@stave.so</a></p>
            </footer>
        </div>
    );
}
