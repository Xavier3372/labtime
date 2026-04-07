import { google } from 'googleapis';

type SheetForm = {
    date: string,
    startTime: string,
    endTime: string,
    title: string,
    teacher: string,
    phone: string,
    numStudents: string,
    level: string,
    class: string,
    subject: string,
    workType: string,
    notes: string,
}

export async function POST(req: Request) {
    try {
        const body: SheetForm = await req.json();
        console.log('Form data received:', { 
            phone: body.phone, 
            date: body.date 
        });

        if (!body.date || !body.phone || !body.numStudents || !body.level || !body.class || !body.subject) {
            console.error('Missing required form fields');
            return Response.json({ 
                message: 'Missing required form fields',
            }, { status: 400 });
        }

        // validate booking date
        const bookingDate = new Date(body.date + 'T00:00:00');
        const dayOfWeek = bookingDate.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            return Response.json({ 
                message: 'Bookings can only be made on working days (Monday to Friday)',
            }, { status: 400 });
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let workingDays = 0;
        const checkDate = new Date(today);
        while (checkDate < bookingDate) {
            checkDate.setDate(checkDate.getDate() + 1);
            const d = checkDate.getDay();
            if (d >= 1 && d <= 5) {
                workingDays++;
            }
        }
        if (workingDays < 5) {
            return Response.json({ 
                message: 'Bookings must be made at least 5 working days in advance',
            }, { status: 400 });
        }

        const auth = new google.auth.GoogleAuth({
            credentials: {
                client_email: process.env.GOOGLE_CLIENT_EMAIL,
                private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: [
                'https://www.googleapis.com/auth/spreadsheets'
            ],
        });

        console.log('Initializing Google Sheets API...');
        const sheets = google.sheets({ version: 'v4', auth });

        // Check if the date is blocked
        const blockedResponse = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Blocked Dates!A:B',
        });

        const blockedRows = blockedResponse.data.values || [];
        for (const row of blockedRows) {
            const rawDate = row[0];
            if (!rawDate) continue;
            const parts = rawDate.split('/');
            if (parts.length === 3) {
                const month = parts[0].padStart(2, '0');
                const day = parts[1].padStart(2, '0');
                const year = parts[2];
                const blockedDateKey = `${year}-${month}-${day}`;
                if (blockedDateKey === body.date) {
                    const reason = row[1] || 'This date is blocked';
                    return Response.json({ 
                        message: `This date is blocked: ${reason}`,
                    }, { status: 400 });
                }
            }
        }

        console.log('Appending data to spreadsheet...');
        
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            requestBody: {
                requests: [
                    {
                        insertDimension: {
                            range: {
                                sheetId: 0, // bookings sheet
                                dimension: 'ROWS',
                                startIndex: 1, // insert after header row
                                endIndex: 2, // insert 1 row
                            },
                        },
                    },
                ],
            },
        });

        // update new row with booking data
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Bookings!A2:L2',
            valueInputOption: 'USER_ENTERED',
            requestBody: { 
                values: [[
                    body.date,
                    body.startTime,
                    body.endTime,
                    body.title,
                    body.teacher,
                    body.phone,
                    body.numStudents,
                    body.level,
                    body.class,
                    body.subject,
                    body.workType,
                    body.notes
                ]]
            }
        });

        return Response.json({ 
            message: 'Booking added successfully', 
            data: response.data 
        }, { status: 200 });
    }
    catch (e: any) {
        console.error('Error message:', e.message);
        console.error('Error details:', e);
        
        let errorMsg = e.message || 'Unknown error occurred';
        if (e.message?.includes('401')) {
            errorMsg = 'Authentication failed - check GOOGLE_PRIVATE_KEY and GOOGLE_CLIENT_EMAIL';
        } else if (e.message?.includes('403')) {
            errorMsg = 'Permission denied - service account may not have access to this spreadsheet';
        } else if (e.message?.includes('404')) {
            errorMsg = 'Spreadsheet or sheet not found - check GOOGLE_SHEET_ID and sheet name';
        }

        return Response.json({ 
            message: 'Error adding booking', 
            error: errorMsg
        }, { status: 500 });
    }
}
