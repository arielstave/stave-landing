'use client';

import * as React from 'react';
import { SmartEditor } from '@/components/smart-editor';
import { ProjectionTable } from '@/components/projection-table';
import { parseStaveText } from '@/lib/parser';
import { exportProjectionToExcel, parseExcelToText } from '@/lib/excel';
import { MonthlyProjection } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';
import { SiteHeader } from '@/components/site-header';
import { cn } from '@/lib/utils';

export default function Home() {
  const [text, setText] = React.useState('');
  const [projection, setProjection] = React.useState<MonthlyProjection[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [isVisible, setIsVisible] = React.useState(false);

  // Update projection when text changes
  React.useEffect(() => {
    const { projection: newProjection } = parseStaveText(text);
    setProjection(newProjection);

    // Visibility: Show if text has "/" or if we have projection data from an upload/input
    if (text.includes('/') || newProjection.length > 0) { // logic refined: if users type '/', show.
      if (text.includes('/')) setIsVisible(true);
      // If file uploaded logic sets text, it will include commands, so it works.
    } else {
      setIsVisible(false);
    }
  }, [text]);

  const handleFile = async (file: File) => {
    if (!file) return;

    setLoading(true);
    try {
      const csvText = await parseExcelToText(file);

      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: csvText }),
      });

      if (!res.ok) throw new Error('Failed to parse with AI');

      const { commands } = await res.json();

      setText(prev => {
        const newText = prev + (prev ? '\n' : '') + commands;
        // Ensure table shows up
        setIsVisible(true);
        return newText;
      });
    } catch (error) {
      console.error(error);
      alert('Failed to parse file.');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    exportProjectionToExcel(projection);
  };

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden bg-background">
      <SiteHeader />

      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Section: Editor */}
        <div className={cn(
          "relative w-full transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden flex flex-col z-20",
          // Empty State: Flex-1 (takes available space), centered content.
          // Active State: h-[40%] (Giving more space to table)
          isVisible ? "h-[40%]" : "flex-1"
        )}>
          <div className={cn(
            "w-full mx-auto px-4 md:px-8 transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] h-full flex flex-col justify-center",
            isVisible ? "max-w-full pt-4 pb-2" : "max-w-4xl min-h-[500px] p-12"
          )}>
            <SmartEditor
              value={text}
              onChange={(e) => setText(e.target.value)}
              onUpload={handleFile}
              className="w-full h-full"
            />
          </div>

          {/* Loading Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-50 flex items-center justify-center pointer-events-none">
              <div className="flex items-center gap-2 text-primary animate-pulse bg-background/80 px-4 py-2 rounded-full border border-primary/20 shadow-xl">
                <Loader2 className="h-5 w-5 animate-spin" />
                <span className="font-mono text-sm">Processing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Section: Projections */}
        <div className={cn(
          "relative w-full flex flex-col bg-background transition-all duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] overflow-hidden z-10",
          isVisible ? "h-[60%]" : "h-0"
        )}>

          {/* Floating Content Area */}
          <div className="flex-1 w-full h-full p-8 flex flex-col items-center justify-center">

            {/* Title */}
            <h3 className="text-xs font-semibold tracking-widest text-muted-foreground uppercase select-none mb-4">Projections</h3>

            {/* Table Wrapper with Sidecar Button */}
            <div className="relative group w-fit mx-auto">

              <ProjectionTable data={projection} visible={true} />

              {/* Sidecar Export Button: Absolute Right of Table */}
              <div className="absolute left-full top-0 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 gap-2 rounded-full bg-black/90 text-white px-4 py-2 text-xs backdrop-blur-md hover:bg-black hover:text-white shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                  onClick={handleExport}
                >
                  <Download className="h-3 w-3" />
                  <span>Export</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
