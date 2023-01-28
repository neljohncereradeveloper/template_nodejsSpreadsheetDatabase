import { InternalServerErrorException } from '@nestjs/common';
import { SPREADSHEET_SCOPE } from './../../constant';
import { SpreadsheetProps } from './../../types';
import { google } from 'googleapis';

interface Props {
  keyFile: any;
  _spreadsheetId: string;
  range: string;
  values: any[];
}

export const updateSpreadsheet = async ({
  keyFile,
  _spreadsheetId,
  range,
  values,
}: Props): Promise<SpreadsheetProps> => {
  try {
    // setting up spreadsheet credentials
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: SPREADSHEET_SCOPE,
    });
    const spreadsheetId = _spreadsheetId;
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    const data = await googleSheets.spreadsheets.values
      .update({
        auth,
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      } as any)
      .then((res) => {
        const bodyData = res?.config.body;
        const _bodyData = bodyData.substr(11).slice(0, -2);
        const data = JSON.parse(_bodyData);

        return data;
      })
      .catch((err) => {
        console.log('appending rows spreadsheet errors : ', err);
        console.log(
          'appending rows spreadsheet errors [message , statuss] : ',
          err.errors[0]
        );
        throw new InternalServerErrorException();
      });

    return data;
  } catch (error) {
    throw new InternalServerErrorException();
  }
};
