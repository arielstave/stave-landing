import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const maxDuration = 30;

export async function POST(req: Request) {
  const { text } = await req.json();

  const prompt = `
    You are Stave, a financial parsing engine.
    Analyze the following raw bank transaction text (CSV or similar) and convert it into Stave Slash Commands.
    
    Stave Commands Format:
    /name [value] [frequency/month]
    
    Rules:
    1. Identify "Recurring Expenses" (e.g., Rent, Netflix, Gym) -> /rent -2000
    2. Identify "Income" (e.g., Salary, Stripe Payout) -> /salary 5000
    3. Identify "One-time" larger expenses or income -> /bonus 5000 dec
    4. Ignore small daily transactions (coffee, groceries) unless they are significant.
    5. Aggregate variable categories if possible (e.g. /groceries -500).
    6. Identify the "Start Date" (Earliest transaction month) -> /date [month] (e.g., /date jan)
    7. Return ONLY the commands, separated by newlines. No markdown, no explanation.
    
    Raw Text:
    ${text}
  `;

  const result = await generateText({
    model: google('gemini-1.5-flash'),
    prompt: prompt,
  });

  return Response.json({ commands: result.text });
}
