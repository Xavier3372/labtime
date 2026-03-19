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
            range: 'Bookings!A2:N',
        });

        const rows = response.data.values || [];
        
        // transform data into date
        const bookingsData: any = {};

        // convert time format
        const parseTimeFormat = (timeStr: any) => {
            if (!timeStr) return 8;
            if (typeof timeStr === 'number') return timeStr; // Already a number
            const timeString = timeStr.toString().trim();
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours + (minutes || 0) / 60;
        };

        rows.forEach((row: any[]) => {
            const [date, startTime, endTime, title, teacher, phone, numStudents, level, classVal, subject, workType, notes, lab, approved] = row;
            
            if (!lab || !date) return; // Skip incomplete rows
            
            if (!approved || approved.toString().toLowerCase() !== 'approved') {
                return;
            }

            if (!bookingsData[lab]) {
                bookingsData[lab] = {};
            }

            if (!bookingsData[lab][date]) {
                bookingsData[lab][date] = [];
            }

            bookingsData[lab][date].push({
                startTime: parseTimeFormat(startTime),
                endTime: parseTimeFormat(endTime),
                title: title || 'Booking',
                instructor: teacher || 'TBD',
                phone: phone || '',
                numStudents: numStudents || '',
                level: level || '',
                class: classVal || '',
                subject: subject || '',
                workType: workType || '',
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
