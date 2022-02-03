import type { NextApiRequest, NextApiResponse } from 'next'
import { extractData } from '../../utils/pdf';
import { request } from '../../utils/request';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { authorization } = req.headers
    if (authorization !== process.env.API_SECRET_KEY) {
      console.log(authorization, process.env.API_SECRET_KEY)
      return res.status(401).json({ success: false });
    }
    const result = await extractData('0x5B2C7F7b685C3Eb8a4e693b755432be54D647C86', 'WETH');
    console.log({ result });
    if (!result) {
      throw new Error('Error extracting the data');
    }
    await request({
      url: '/api/record',
      method: 'POST',
      data: result,
    });
    return res.json(result);
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).send({
      success: false
    })
  }
}
