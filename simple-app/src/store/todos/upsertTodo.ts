import { Todo } from '../../types';
import { db } from '../db';
import { parseRow, Row } from './row';

export interface Input {
  id: string;
  createdBy: string;
  boardId: string;
  text: string;
  completed: boolean;
}

export async function upsertTodo(input: Input): Promise<Todo> {
  console.log({ input });
  const query = `
INSERT INTO todos (id, created_by, board_id, text, completed) 
VALUES ($(id), $(createdBy), $(boardId), $(text), $(completed))
ON CONFLICT (id)  
DO UPDATE SET date_updated = (now() at time zone 'utc'), created_by = $(createdBy), board_id = $(boardId), text = $(text), completed = $(completed)
RETURNING *;`;

  const [row] = await db.any<Row>(query, input);
  return parseRow(row);
}
