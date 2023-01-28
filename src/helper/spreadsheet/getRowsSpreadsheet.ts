import { SPREADSHEET_SCOPE } from './../../constant';
import { google } from 'googleapis';
import { InternalServerErrorException } from '@nestjs/common';

interface Props {
  keyFile: any;
  _spreadsheetId: string;
  range: string;
}

export const getRowsSpreadsheet = async ({
  keyFile,
  _spreadsheetId,
  range,
}: Props): Promise<any> => {
  try {
    // setting up spreadsheet credentials
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: SPREADSHEET_SCOPE,
    });
    const spreadsheetId = _spreadsheetId;
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    const dataRows = await googleSheets.spreadsheets.values
      .get({
        auth,
        spreadsheetId,
        range,
      })
      .then((res) => {
        return res.data.values;
      })
      .catch((err) => {
        console.log('getting rows spreadsheet errors : ', err);
        console.log(
          'getting rows spreadsheet errors [message , statuss] : ',
          err.errors[0]
        );
        throw new InternalServerErrorException();
      });
    return { data: dataRows };
  } catch (error) {
    throw new InternalServerErrorException();
  }
};
