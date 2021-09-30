import { db } from '../db';
import { Board } from '../../types';
import { parseRow, Row } from './row';

export interface Input {
  ids?: string[];
}

export interface Output {
  boards: Board[];
}

export async function listBoards(input: Input = {}): Promise<Output> {
  const [conditionalsSQL, args] = buildWhereClause(input);

  const query = `
  SELECT *
  FROM boards
  ${conditionalsSQL}
  ORDER BY date_created;`;

  const rows = await db.any<Row>(query, args);

  const boards = rows.map(parseRow);
  return { boards };
}

function buildWhereClause(input: Input): [string, object] {
  const conditionals: string[] = [];
  if (input.ids) {
    conditionals.push(`id in ($(ids:csv))`);
  }

  if (conditionals.length === 0) return ['', {}];
  return [`WHERE ${conditionals.join(' AND ')}`, input];
}
