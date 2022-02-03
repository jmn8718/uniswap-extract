import type { NextApiRequest, NextApiResponse } from 'next';
import { saveData } from '../../utils/storage';
import { Data } from '../../utils/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { authorization } = req.headers
    if (authorization !== process.env.API_SECRET_KEY) {
      return res.status(401).json({ success: false });
    }
    saveData(req.body as Data)
      .catch(console.error);
    return res.json({ success: true });
  } catch (error: any) {
    console.error(error.message);
    return res.status(500).send({
      success: false
    })
  }
}
