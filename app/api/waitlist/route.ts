import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email is required' }, { status: 400 });
        }

        const webhookUrl = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

        if (webhookUrl) {
            // Send to Google Sheets
            await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, timestamp: new Date().toISOString() }),
            });
        } else {
            console.warn('GOOGLE_SHEETS_WEBHOOK_URL not set. Email received:', email);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Waitlist API Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
