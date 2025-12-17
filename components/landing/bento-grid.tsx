'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ReactNode, useEffect } from 'react';
import { AutoZoomCard } from './AutoZoomCard';

// Card Component
function BentoCard({
    className,
    title,
    description,
    children,
    delay = 0
}: {
    className?: string;
    title: string;
    description: string;
    children?: ReactNode;
    delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay }}
            className={cn(
                "group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-white p-6 md:p-8 shadow-sm transition-all hover:shadow-md hover:-translate-y-1",
                className
            )}
        >
            <div className="mb-4 relative z-10">
                <h3 className="text-xl font-semibold tracking-tight text-black mb-2">{title}</h3>
                <p className="text-muted-foreground">{description}</p>
            </div>

            {/* Visual Area */}
            <div className="relative mt-auto h-48 w-full overflow-hidden rounded-lg bg-gray-50 border border-gray-100/50">
                {children}
            </div>
        </motion.div>
    );
}

export function BentoGrid() {
    // Media Playback Speed Adjustment
    // We use a useEffect to forcibly set the playbackRate to 2.0 for specific videos
    // because HTML attributes do not support this standard property.
    useEffect(() => {
        const videosToSpeedUp = ['video-ide', 'video-state'];

        videosToSpeedUp.forEach((id) => {
            const videoEl = document.getElementById(id) as HTMLVideoElement;
            if (videoEl) {
                videoEl.playbackRate = 2.0;
            }
        });
    }, []);

    return (
        <section id="features" className="container py-24 px-4 max-w-screen-xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(360px,auto)]">

                {/* Card 1: Wide - Editor */}
                <BentoCard
                    className="md:col-span-2 lg:col-span-2"
                    title="The First Financial IDE 🛠️"
                    description="Finance is code. Stave gives you a specialized editor to build models, not just a chat window."
                    delay={0.1}
                >
                    <video
                        id="video-ide"
                        className="h-full w-full object-cover rounded-lg"
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/screen-editor.png"
                    >
                        <source src="/videos/ide-upload-demo.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </BentoCard>

                {/* Card 2: Standard - State */}
                <BentoCard
                    className="md:col-span-1 lg:col-span-1"
                    title="Stateful Documents 📝"
                    description="Not ephemeral like a chat. Backspace to edit. Your model reacts instantly."
                    delay={0.2}
                >
                    <video
                        id="video-state"
                        className="h-full w-full object-cover object-center rounded-lg"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/videos/stateful-docs.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </BentoCard>

                {/* Card 3: Standard - Import */}
                <BentoCard
                    className="md:col-span-1 lg:col-span-1"
                    title="AI Bank Imports 🧠"
                    description="Upload a messy CSV. Stave cleans it, categorizes it, and writes the code for you."
                    delay={0.3}
                >
                    <video
                        className="h-full w-full object-cover rounded-lg"
                        autoPlay
                        loop
                        muted
                        playsInline
                    >
                        <source src="/videos/ai-bank-imports.mp4" type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                </BentoCard>

                {/* Card 4: Wide - Runway */}
                <BentoCard
                    className="md:col-span-2 lg:col-span-2"
                    title="Speed of Excel, Simplicity of a Note ⚡"
                    description="Turn the 'Runway' problem from a weekend headache into a 5-minute sketch."
                    delay={0.4}
                >
                    {/* Replaced AutoZoomCard with a static image */}
                    <AutoZoomCard
                        src="/screen-state.png"
                        alt="Runway Projection"
                        zoomOrigin="bottom center"
                        className="w-full h-full"
                        staticImage={true}
                    />
                </BentoCard>

            </div>
        </section>
    );
}
