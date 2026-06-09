import { kv } from '@vercel/kv';
import { QuizSubmission } from './questions';

const LIST_KEY = 'submissions';

export async function saveSubmission(submission: QuizSubmission): Promise<void> {
  // Store individual submission by ID
  await kv.set(`submission:${submission.id}`, JSON.stringify(submission));
  // Prepend ID to the list
  await kv.lpush(LIST_KEY, submission.id);
}

export async function getSubmissions(): Promise<QuizSubmission[]> {
  // Get all IDs
  const ids = await kv.lrange<string>(LIST_KEY, 0, -1);
  if (!ids || ids.length === 0) return [];

  // Fetch all submissions in parallel
  const items = await Promise.all(
    ids.map(id => kv.get<string>(`submission:${id}`))
  );

  return items
    .filter(Boolean)
    .map(item => (typeof item === 'string' ? JSON.parse(item) : item) as QuizSubmission);
}
