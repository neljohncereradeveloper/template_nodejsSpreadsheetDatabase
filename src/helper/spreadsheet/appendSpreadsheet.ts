import { InternalServerErrorException } from '@nestjs/common';
import { SPREADSHEET_SCOPE } from './../../constant';
import { google } from 'googleapis';

interface Props {
  keyFile: any;
  _spreadsheetId: string;
  range: string;
  values: any[];
}

export const appendSpreadsheet = async ({
  keyFile,
  _spreadsheetId,
  range,
  values,
}: Props): Promise<any> => {
  try {
    // setting up spreadsheet credentialsS
    const auth = new google.auth.GoogleAuth({
      keyFile,
      scopes: SPREADSHEET_SCOPE,
    });
    const spreadsheetId = _spreadsheetId;
    const client = await auth.getClient();
    const googleSheets = google.sheets({ version: 'v4', auth: client });

    const data = await googleSheets.spreadsheets.values
      .append({
        auth,
        spreadsheetId,
        range,
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values: [values],
        },
      })
      .then((res) => {
        const bodyData = res.config.body;
        const _bodyData = bodyData.substr(11).slice(0, -2);
        const _data = JSON.parse(_bodyData);

        return _data;
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
