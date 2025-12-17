'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface AutoZoomCardProps {
    src: string;
    alt: string;
    zoomOrigin?: string; // CSS transform-origin
    caption?: string;
    className?: string;
    staticImage?: boolean;
}

export function AutoZoomCard({
    src,
    alt,
    zoomOrigin = 'center',
    caption,
    className,
    staticImage = false
}: AutoZoomCardProps) {
    return (
        <div className={cn("relative w-full h-full overflow-hidden rounded-lg bg-gray-100 border border-gray-200/50", className)}>
            <motion.div
                className="w-full h-full"
                initial={{ scale: 1 }}
                animate={staticImage ? { scale: 1 } : { scale: 1.3 }}
                transition={{
                    duration: 8,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse"
                }}
                style={{ transformOrigin: zoomOrigin }}
            >
                <div className="relative w-full h-full">
                    <Image
                        src={src}
                        alt={alt}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                </div>
            </motion.div>

            {/* Optional Overlay/Caption */}
            {caption && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent text-white text-sm font-medium">
                    {caption}
                </div>
            )}

            {/* Subtle inner shadow for depth */}
            <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
        </div>
    );
}
