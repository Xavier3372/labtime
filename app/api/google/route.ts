import { google } from 'googleapis';

type SheetForm = {
    lab: string,
    date: string,
    startTime: string,
    endTime: string,
    title: string,
    teacher: string,
    email: string,
    phone: string,
    notes: string,
}

export async function POST(req: Request) {
    try {
        const body: SheetForm = await req.json();
        console.log('Form data received:', { 
            lab: body.lab, 
            email: body.email, 
            date: body.date 
        });

        if (!body.lab || !body.date || !body.email || !body.phone) {
            console.error('Missing required form fields');
            return Response.json({ 
                message: 'Missing required form fields',
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

        console.log('Appending data to spreadsheet...');
        
        await sheets.spreadsheets.batchUpdate({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            requestBody: {
                requests: [
                    {
                        insertDimension: {
                            range: {
                                sheetId: 0, // Bookings sheet
                                dimension: 'ROWS',
                                startIndex: 1, // Insert after header row (row 1)
                                endIndex: 2, // Insert 1 row
                            },
                        },
                    },
                ],
            },
        });

        // Now update the new row with the booking data
        const response = await sheets.spreadsheets.values.update({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: 'Bookings!A2:I2',
            valueInputOption: 'USER_ENTERED',
            requestBody: { 
                values: [[
                    body.lab,
                    body.date,
                    body.startTime,
                    body.endTime,
                    body.title,
                    body.teacher,
                    body.email,
                    body.phone,
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
