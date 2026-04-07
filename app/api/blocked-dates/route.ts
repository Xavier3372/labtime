import { google } from 'googleapis';

export async function GET() {
    try {
        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets'
            ],
        });

        const sheets = google.sheets({ version: 'v4', auth });

        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Blocked Dates!A:B',
        });

        const rows = response.data.values || [];

        const blockedDates: Record<string, string> = {};

        rows.forEach((row: any[]) => {
            const rawDate = row[0];
            const reason = row[1] || 'Blocked';
            if (!rawDate) return;

            // Parse MM/DD/YYYY format and convert to YYYY-MM-DD
            let dateKey: string;
            try {
                const parts = rawDate.split('/');
                if (parts.length === 3) {
                    const month = parts[0].padStart(2, '0');
                    const day = parts[1].padStart(2, '0');
                    const year = parts[2];
                    dateKey = `${year}-${month}-${day}`;
                } else {
                    // Fallback: try Date parsing
                    const parsed = new Date(rawDate);
                    if (isNaN(parsed.getTime())) return;
                    const year = parsed.getFullYear();
                    const month = String(parsed.getMonth() + 1).padStart(2, '0');
                    const day = String(parsed.getDate()).padStart(2, '0');
                    dateKey = `${year}-${month}-${day}`;
                }
            } catch {
                return;
            }

            blockedDates[dateKey] = reason;
        });

        return Response.json(blockedDates, { status: 200 });
    }
    catch (e: any) {
        console.error('Error fetching blocked dates:', e.message);
        return Response.json({ 
            error: 'Failed to fetch blocked dates'
        }, { status: 500 });
    }
}
