'use server';

import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

export async function subscribeUser(formData: FormData) {
    const email = formData.get('email') as string;

    if (!email) return;

    try {
        const serviceAccountAuth = new JWT({
            email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            scopes: ['https://www.googleapis.com/auth/spreadsheets'],
        });

        const doc = new GoogleSpreadsheet(
            '16y-kg-G-DDQlJbs2Fc-tcm2mD71LshpmVHVRapZqSBA',
            serviceAccountAuth
        );

        await doc.loadInfo();
        const sheet = doc.sheetsByIndex[0];

        await sheet.addRow({
            Email: email,
            Date: new Date().toISOString(),
        });

        return { success: true };
    } catch (e) {
        console.error('Google Sheets Error:', e);
        return { success: false, error: 'Failed to save email' };
    }
}
