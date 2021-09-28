import { db } from '../db';

export interface Input {
  id: string;
}

export async function deleteTodo(input: Input) {
  const query = `
DELETE FROM todos where id = $(id);
`;

  await db.none(query, input);
}
