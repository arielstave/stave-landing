"use client"

import * as React from "react"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

interface SmartEditorProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    className?: string
    onUpload?: (file: File) => void
}

const PLACEHOLDERS = [
    "/starting 50000",
    "/revenue 12000",
    "/rent -2000",
    "/tax -5000 apr",
    "/bonus 2000 dec",
    "/server -100 monthly",
    "/seed_round 150000 jan",
    "/client_retainer 5000",
    "/aws_hosting -200 monthly",
    "/tax_payment -8000 apr",
    "/hire_developer -6000 may",
    "/black_friday 25000 nov",
    "/meta_ads -3000",
    "/new_macbooks -5000 once",
    "/wework_rent -1500",
    "/saas_subscriptions -450"
];

export function SmartEditor({ className, onUpload, ...props }: SmartEditorProps) {
    const [placeholder, setPlaceholder] = React.useState("");
    const [index, setIndex] = React.useState(0);
    const [subIndex, setSubIndex] = React.useState(0);
    const [reverse, setReverse] = React.useState(false);
    const [blink, setBlink] = React.useState(true);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    // Typewriter Effect
    React.useEffect(() => {
        if (index >= PLACEHOLDERS.length) {
            setIndex(0);
            return;
        }

        if (subIndex === PLACEHOLDERS[index].length + 1 && !reverse) {
            const timeout = setTimeout(() => setReverse(true), 1500);
            return () => clearTimeout(timeout);
        }

        if (subIndex === 0 && reverse) {
            setReverse(false);
            setIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
            return;
        }

        const timeout = setTimeout(() => {
            setSubIndex((prev) => prev + (reverse ? -1 : 1));
        }, reverse ? 50 : 100);

        return () => clearTimeout(timeout);
    }, [subIndex, index, reverse]);

    React.useEffect(() => {
        setPlaceholder(PLACEHOLDERS[index].substring(0, subIndex));
    }, [subIndex, index]);

    React.useEffect(() => {
        const interval = setInterval(() => setBlink(b => !b), 500);
        return () => clearInterval(interval);
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file && onUpload) {
            onUpload(file);
        }
        // reset
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    return (
        <div className="relative w-full h-full flex flex-col">
            {/* Premium Sandbox Container */}
            <div className="relative flex-1 w-full bg-card dark:bg-card border border-input rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-ring transition-all overflow-hidden group">
                <Textarea
                    className={cn(
                        "w-full h-full resize-none border-none focus-visible:ring-0 text-sm font-mono bg-transparent p-6 pb-16 leading-relaxed z-10 relative",
                        "scrollbar-hide",
                        className
                    )}
                    placeholder=""
                    {...props}
                    style={{ msOverflowStyle: 'none', scrollbarWidth: 'none' }}
                />

                {!props.value && (
                    <div className="absolute top-6 left-6 text-sm font-mono text-muted-foreground/50 pointer-events-none z-0">
                        {placeholder}{blink && !reverse && subIndex === PLACEHOLDERS[index].length ? "|" : ""}
                    </div>
                )}

                {/* Upload Button: Inside Wrapper (Bottom Right) */}
                <div className="absolute bottom-4 right-4 z-20">
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".csv, .xlsx, .xls"
                        onChange={handleFileChange}
                    />
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="h-9 w-9 shadow-sm rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-all hover:scale-105"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    <Plus className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent side="left">
                                <p>Upload file</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Footer / Tips: Outside Wrapper (Bottom Left) */}
            <div className="mt-3 px-4 flex justify-between items-center z-20 select-none">
                <span className="text-xs text-muted-foreground font-medium">
                    Tips: Negative amounts are expenses. Type /reset to clear.
                </span>
            </div>

            <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
      `}</style>
        </div>
    )
}

