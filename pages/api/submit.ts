import type { NextApiRequest, NextApiResponse } from 'next';
import { saveSubmission } from '../../lib/storage';
import { QuizSubmission } from '../../lib/questions';
import { v4 as uuidv4 } from '../../lib/uuid';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { answers, contact } = req.body;

    const submission: QuizSubmission = {
      id: uuidv4(),
      submittedAt: new Date().toISOString(),
      answers,
      contact,
    };

    await saveSubmission(submission);

    return res.status(200).json({ success: true, id: submission.id });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to save submission' });
  }
}
