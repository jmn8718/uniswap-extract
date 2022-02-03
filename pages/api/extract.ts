// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { extractData } from '../../utils/pdf';
import { saveData } from '../../utils/storage';

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
    if (!result) {
      throw new Error('Error extracting the data');
    }
    await saveData(result);
    console.log(result)
    return res.json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false
    })
  }
}
