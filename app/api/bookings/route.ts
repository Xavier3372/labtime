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
            range: 'Bookings!A2:J', // Include column J for approved status
        });

        const rows = response.data.values || [];
        
        // Transform the data into the calendar format
        const bookingsData: any = {};

        rows.forEach((row: any[]) => {
            const [lab, date, startTime, endTime, title, teacher, email, phone, notes, approved] = row;
            
            if (!lab || !date) return; // Skip incomplete rows
            
            // Only include if approved is explicitly true=
            if (!approved || (approved.toString().toLowerCase() !== 'true' && approved !== true)) {
                return;
            }

            if (!bookingsData[lab]) {
                bookingsData[lab] = {};
            }

            if (!bookingsData[lab][date]) {
                bookingsData[lab][date] = [];
            }

            bookingsData[lab][date].push({
                startTime: parseInt(startTime) || 8,
                endTime: parseInt(endTime) || 9,
                title: title || 'Booking',
                instructor: teacher || 'TBD',
                email: email || '',
                phone: phone || '',
                notes: notes || '',
                approved: approved
            });
        });

        return Response.json(bookingsData, { status: 200 });
    }
    catch (e: any) {
        console.error('Error fetching bookings:', e.message);
        return Response.json({ 
            error: 'Failed to fetch bookings'
        }, { status: 500 });
    }
}
