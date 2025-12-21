import { MonthlyProjection } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface ProjectionTableProps {
    data: MonthlyProjection[]
    visible?: boolean
}

export function ProjectionTable({ data, visible = false }: ProjectionTableProps) {
    if (!visible || data.length === 0) return null;

    const rows = [
        { key: 'opening', label: 'Opening', color: 'text-zinc-500 dark:text-zinc-400' },
        { key: 'income', label: 'Income', color: 'text-emerald-600 dark:text-emerald-400' },
        { key: 'fixed', label: 'Fixed', color: 'text-rose-600 dark:text-rose-400' },
        { key: 'variable', label: 'Variable', color: 'text-rose-600 dark:text-rose-400' },
        { key: 'closing', label: 'Closing', color: 'font-bold text-foreground' },
    ] as const;

    const isCompact = data.length > 8;
    const colWidth = isCompact ? 'min-w-[80px] px-2 text-xs' : 'min-w-[120px] px-4 text-sm';

    const formatValue = (val: number, key: string) => {
        const rounded = Math.round(val);
        if (rounded === 0) return <span className="text-muted-foreground/30">$ -</span>;

        const formatted = rounded.toLocaleString();
        return key === 'closing' && rounded < 0 ? `(${Math.abs(rounded).toLocaleString()})` : formatted;
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-500">

            <Card className="w-fit max-w-full mx-auto bg-background/50 backdrop-blur-xl border-border shadow-2xl rounded-3xl overflow-hidden max-h-full h-full overflow-y-auto">
                <CardContent className="p-0">
                    <ScrollArea className="w-full whitespace-nowrap">
                        <div className="flex flex-col min-w-max">
                            {/* Header Row (Months) */}
                            <div className="flex border-b border-border/50">
                                <div className="w-24 shrink-0 px-3 py-1.5 font-mono text-xs text-muted-foreground sticky left-0 bg-background/95 backdrop-blur z-10 flex items-center">
                                    Metric
                                </div>
                                {data.map((month) => (
                                    <div key={month.month} className={cn(colWidth, "shrink-0 py-1.5 font-mono text-muted-foreground text-right border-l border-border/10")}>
                                        {month.month}
                                    </div>
                                ))}
                            </div>

                            {/* Data Rows */}
                            {rows.map((row) => (
                                <div key={row.key} className="flex border-b border-border/40 last:border-0 hover:bg-muted/30 transition-colors">
                                    {/* Row Header */}
                                    <div className="w-24 shrink-0 px-3 py-1.5 text-xs font-medium text-muted-foreground sticky left-0 bg-background/95 backdrop-blur z-10 border-r border-border/50 flex items-center">
                                        {row.label}
                                    </div>

                                    {/* Row Data */}
                                    {data.map((month) => {
                                        //
                                        const val = month[row.key];
                                        const isNegativeClosing = row.key === 'closing' && val < 0;

                                        return (
                                            <div
                                                key={`${row.key}-${month.month}`}
                                                className={cn(
                                                    colWidth,
                                                    "shrink-0 py-1.5 font-mono text-right flex items-center justify-end border-l border-border/10 tabular-nums",
                                                    row.color,
                                                    isNegativeClosing && "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                                                )}
                                            >
                                                {formatValue(val, row.key)}
                                            </div>
                                        )
                                    })}
                                </div>
                            ))}
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    )
}
