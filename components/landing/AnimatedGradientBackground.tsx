'use client';

import { motion } from 'framer-motion';

export function AnimatedGradientBackground() {
    return (
        <div className="fixed inset-0 -z-0 overflow-hidden bg-white pointer-events-none">
            {/* Orbs Container - Increased opacity/saturation for visibility */}
            <div className="absolute inset-0 opacity-60">
                {/* Orb 1: Indigo - Top Left */}
                <motion.div
                    className="absolute -top-[10%] -left-[10%] h-[70vh] w-[70vh] rounded-full bg-indigo-300 blur-[100px]"
                    animate={{
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                    }}
                />

                {/* Orb 2: Purple - Top Right/Center */}
                <motion.div
                    className="absolute top-[10%] right-[10%] h-[60vh] w-[60vh] rounded-full bg-purple-300 blur-[100px]"
                    animate={{
                        x: [0, -30, 0],
                        y: [0, 50, 0],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                    }}
                />

                {/* Orb 3: Blue - Bottom Center */}
                <motion.div
                    className="absolute -bottom-[20%] left-[20%] h-[80vh] w-[80vh] rounded-full bg-blue-300 blur-[100px]"
                    animate={{
                        x: [0, 40, 0],
                        y: [0, -40, 0],
                        scale: [1, 1.1, 1],
                    }}
                    transition={{
                        duration: 30,
                        repeat: Infinity,
                        repeatType: "reverse",
                        ease: "linear",
                    }}
                />
            </div>

            {/* Noise Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`
                }}
            />
        </div>
    );
}
