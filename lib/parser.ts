import { StaveCommand, MonthlyProjection } from './types';

const FIXED_KEYWORDS = ['rent', 'mortgage', 'insurance', 'subscription', 'wifi', 'internet', 'netflix', 'spotify', 'gym', 'aws', 'ads', 'hosting'];
const INCOME_KEYWORDS = ['salary', 'paycheck', 'bonus', 'dividend', 'income', 'revenue', 'consultant', 'retainer'];

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];

export function parseStaveText(text: string): { commands: StaveCommand[], projection: MonthlyProjection[] } {
    const lines = text.split('\n');
    const commands: StaveCommand[] = [];

    // Date Engine Defaults
    const now = new Date();
    let startMonthIndex = now.getMonth();
    let startYear = now.getFullYear();
    let projectionMonths = 1; // Default to 1 column

    let openingBalance = 0;
    let hasOpening = false;

    // 1. First Pass: Detect Global Configs (Opening, Date, Months)
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed.startsWith('/')) return;

        const parts = trimmed.substring(1).split(/\s+/);
        const cmd = parts[0].toLowerCase();
        const args = parts.slice(1);

        // Opening Balance Fix
        if (['starting', 'opening', 'balance'].includes(cmd) ||
            (cmd === 'starting' && args[0] === 'balance')) { // Handle "/starting balance 500"

            // Find the first number
            const value = args.find(a => /^-?\d+/.test(a));
            if (value) {
                openingBalance = parseFloat(value);
                hasOpening = true;
            }
            return; // Do NOT process as a regular command
        }

        // Date Engine: /date [Month] [Year?]
        if (cmd === 'date' || cmd === 'start') {
            const monthArg = args[0]?.toLowerCase().slice(0, 3);
            const yearArg = args[1];

            const idx = MONTHS.indexOf(monthArg);
            if (idx !== -1) startMonthIndex = idx;

            if (yearArg && /^\d{2,4}$/.test(yearArg)) {
                let y = parseInt(yearArg);
                if (y < 100) y += 2000; // Handle 2-digit year
                startYear = y;
            } else {
                // If manual date set without year, try to infer? 
                // If month is before current month, maybe next year? 
                // Keep simple: use current year unless specified.
                // If user says /date jan and it is currently dec, they probably mean next jan.
                if (idx < now.getMonth()) {
                    startYear = now.getFullYear() + 1;
                } else {
                    startYear = now.getFullYear();
                }
            }
        }

        // Dynamic Columns: /months [N]
        if (cmd === 'months') {
            const n = parseInt(args[0]);
            if (!isNaN(n) && n > 0) projectionMonths = n;
        }
    });

    // 2. Second Pass: Parse Regular Commands
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed.startsWith('/')) return;

        // Skip config commands we already handled
        const cmdName = trimmed.substring(1).split(/\s+/)[0].toLowerCase();
        if (['starting', 'opening', 'balance', 'date', 'start', 'months'].includes(cmdName)) return;

        // Regex to match: /name value [month/freq]
        const match = trimmed.match(/^\/(\w+)\s+([+-]?\d+(?:\.\d+)?)(%?)(?:\s+(.*))?/);

        if (match) {
            const [, name, valueStr, isPercentStr, extra] = match;
            const value = parseFloat(valueStr);
            const isPercent = isPercentStr === '%';

            let category: 'income' | 'fixed' | 'variable' = 'variable';
            const lowerName = name.toLowerCase();

            if (INCOME_KEYWORDS.some(k => lowerName.includes(k)) || (value > 0 && !isPercent)) {
                if (value > 0) category = 'income';
            }

            if (category !== 'income') {
                if (FIXED_KEYWORDS.some(k => lowerName.includes(k))) {
                    category = 'fixed';
                } else {
                    category = 'variable';
                }
            }

            commands.push({
                type: isPercent ? 'modifier' : (extra ? 'onetime' : 'recurring'),
                name: lowerName,
                value,
                isPercent,
                frequency: extra,
                category
            });
        }
    });

    // Empty State Logic
    // If no commands AND no opening balance explicitly set, return empty projection
    if (commands.length === 0 && !hasOpening && text.trim().length === 0) {
        return { commands: [], projection: [] };
    }

    // Calculate Projection
    const projection: MonthlyProjection[] = [];
    let currentBalance = openingBalance;

    for (let i = 0; i < projectionMonths; i++) { // Dynamic Columns
        // Calculate actual date for this column
        let targetMonthIndex = startMonthIndex + i;
        const targetYear = startYear + Math.floor(targetMonthIndex / 12);
        targetMonthIndex = targetMonthIndex % 12;

        const monthName = MONTHS[targetMonthIndex];
        // Format: "Month YY" e.g. "Dec 25"
        const displayMonth = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${targetYear.toString().slice(-2)}`;

        const opening = currentBalance;
        let income = 0;
        let fixed = 0;
        let variable = 0;

        commands.forEach(cmd => {
            if (cmd.isPercent) return;

            let applies = false;
            if (!cmd.frequency) {
                applies = true;
            } else {
                // Fuzzy match frequency
                if (cmd.frequency.toLowerCase().includes(monthName)) {
                    // Should also check year if specified in frequency? 
                    // MVP: Ignore year in frequency for now, just month match.
                    applies = true;
                }
                // Handle "once" keyword?
                if (cmd.frequency.toLowerCase() === 'once' && i === 0) {
                    applies = true; // Apply only to first column? Or heuristic?
                    // "once" usually implies one-time. If no month specified, apply to first month?
                }
            }

            if (applies) {
                if (cmd.category === 'income') income += cmd.value;
                else if (cmd.category === 'fixed') fixed += cmd.value;
                else variable += cmd.value;
            }
        });

        const closing = opening + income + fixed + variable;
        projection.push({
            month: displayMonth,
            opening,
            income,
            fixed: Math.abs(fixed),
            variable: Math.abs(variable),
            closing
        });

        currentBalance = closing;
    }

    return { commands, projection };
}
