import { google } from 'googleapis';
import { Data } from './types';

const { 
  GOOGLE_PROJECT_ID,
  GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_CLIENT_EMAIL,
  GOOGLE_SPREADSHEET_ID
} = process.env;

const getAccessToken = async () => {
  const client = new google.auth.GoogleAuth({
    projectId: GOOGLE_PROJECT_ID,
    credentials: {
      client_id: GOOGLE_CLIENT_ID,
      client_email: GOOGLE_CLIENT_EMAIL,
      private_key: GOOGLE_CLIENT_SECRET?.replace(/\\n/g, '\n'),
    },
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets'
    ]
  });

  return client.getClient()
}
export const saveData = async (data: Data) => {
  const auth = await getAccessToken()
  const sheets = google.sheets({ version: 'v4', auth });
  const result = await sheets.spreadsheets.values.append({
    spreadsheetId: GOOGLE_SPREADSHEET_ID,
    valueInputOption: 'RAW',
    range: 'uniswap!A1',
    requestBody: {
      values: [[new Date().toISOString() ,data.liquidity.WETH, data.liquidity.USDT, data.earned.WETH,data.earned.USDT]]
    }
  });
}