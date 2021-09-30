import { Board } from '../../types';
import { db } from '../db';
import { parseRow, Row } from './row';

export interface Input {
  id: string;
  createdBy: string;
  name: string;
}

export async function upsertBoard(input: Input): Promise<Board> {
  const query = `
INSERT INTO boards (id, created_by, name) 
VALUES ($(id), $(createdBy), $(name))
ON CONFLICT (id)  
DO UPDATE SET date_updated = (now() at time zone 'utc'), name = $(name)
RETURNING *;`;

  const [row] = await db.any<Row>(query, input);
  return parseRow(row);
}
