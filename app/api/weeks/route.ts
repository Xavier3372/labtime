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
            range: 'Weeks!A:B',
        });

        const rows = response.data.values || [];

        // Build a map of Monday date -> label
        // Column A = Monday date, Column B = label text
        const weeksMap: Record<string, string> = {};

        rows.forEach((row: any[]) => {
            const rawDate = row[0];
            const label = row[1];
            if (!rawDate || !label) return;

            // Normalize the date to YYYY-MM-DD format
            let dateKey: string;
            try {
                const parsed = new Date(rawDate);
                if (isNaN(parsed.getTime())) return;
                const year = parsed.getFullYear();
                const month = String(parsed.getMonth() + 1).padStart(2, '0');
                const day = String(parsed.getDate()).padStart(2, '0');
                dateKey = `${year}-${month}-${day}`;
            } catch {
                return;
            }

            weeksMap[dateKey] = label;
        });

        return Response.json(weeksMap, { status: 200 });
    }
    catch (e: any) {
        console.error('Error fetching weeks:', e.message);
        return Response.json({ 
            error: 'Failed to fetch weeks data'
        }, { status: 500 });
    }
}
