import { google } from 'googleapis';

export async function POST(req: Request) {
    try {
        const { phone } = await req.json();

        if (!phone) {
            return Response.json({ 
                error: 'Phone number is required'
            }, { status: 400 });
        }

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
            range: 'Bookings!A2:M',
        });

        const rows = response.data.values || [];
        
        // Filter bookings by phone number
        const userBookings: any[] = [];

        // Convert time format "08:30" to decimal 8.5
        const parseTimeFormat = (timeStr: any) => {
            if (!timeStr) return 8;
            if (typeof timeStr === 'number') return timeStr; // Already a number
            const timeString = timeStr.toString().trim();
            const [hours, minutes] = timeString.split(':').map(Number);
            return hours + (minutes || 0) / 60;
        };

        rows.forEach((row: any[]) => {
            const [date, startTime, endTime, title, teacher, userPhone, numStudents, level, classVal, subject, notes, lab, approved] = row;
            
            if (!lab || !date) return; // Skip incomplete rows
            
            // Match phone number
            if (userPhone && userPhone.toString().trim() === phone.toString().trim()) {
                userBookings.push({
                    lab,
                    date,
                    startTime: parseTimeFormat(startTime),
                    endTime: parseTimeFormat(endTime),
                    title: title || 'Booking',
                    teacher: teacher || 'TBD',
                    phone: userPhone,
                    numStudents: numStudents || '',
                    level: level || '',
                    class: classVal || '',
                    subject: subject || '',
                    notes: notes || '',
                    approved: approved?.toString().toLowerCase() === 'approved' ? 'approved' : approved?.toString().toLowerCase() === 'rejected' ? 'rejected' : 'pending',
                    approvalStatus: approved?.toString().toLowerCase() === 'approved' ? 'Approved' : approved?.toString().toLowerCase() === 'rejected' ? 'Rejected' : 'Pending'
                });
            }
        });

        return Response.json({ 
            bookings: userBookings,
            count: userBookings.length
        }, { status: 200 });
    }
    catch (e: any) {
        console.error('Error fetching user bookings:', e.message);
        return Response.json({ 
            error: 'Failed to fetch bookings'
        }, { status: 500 });
    }
}
