import type { NextApiRequest, NextApiResponse } from 'next';
import { getSubmissions } from '../../lib/storage';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const submissions = await getSubmissions();
    return res.status(200).json(submissions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load submissions' });
  }
}
