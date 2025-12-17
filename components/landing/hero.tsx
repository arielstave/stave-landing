'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export function Hero() {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative flex flex-col items-center justify-center min-h-screen pt-20 pb-40 px-4 text-center">

            <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.15,
                            delayChildren: 0.2
                        }
                    }
                }}
                className="flex flex-col items-center gap-6 max-w-4xl mx-auto z-10"
            >
                {/* Badge */}
                <motion.div
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                >
                    <div className="inline-flex items-center rounded-full border border-gray-200/60 bg-white/50 px-3 py-1 text-sm font-medium text-gray-600 backdrop-blur-sm shadow-sm">
                        Public Beta Coming Soon 🚧
                    </div>
                </motion.div>

                {/* Headline */}
                <motion.h1
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-black max-w-4xl"
                >
                    Stop wrestling with <br className="hidden sm:block" /> spreadsheets.
                </motion.h1>

                {/* Subhead */}
                <motion.p
                    variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
                    className="text-lg md:text-xl text-gray-500 max-w-2xl leading-relaxed font-medium"
                >
                    The text-first financial modeler for founders. Zero formulas.
                </motion.p>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                    <Button
                        onClick={() => scrollToSection('waitlist')}
                        className="h-12 px-8 text-base bg-black text-white hover:bg-black/90 rounded-full shadow-lg hover:shadow-xl transition-all"
                    >
                        Join Waitlist
                    </Button>

                    <Button
                        variant="outline"
                        onClick={() => scrollToSection('features')}
                        className="h-12 px-8 text-base bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:text-black rounded-full shadow-sm transition-all group"
                    >
                        See how Stave works
                        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                </div>
            </motion.div>
        </section >
    );
}
