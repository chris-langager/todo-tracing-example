import { db } from '../db';
import { Todo } from '../../types';
import { parseRow, Row } from './row';

export interface Input {
  ids?: string[];
  boardIds?: string[];
}

export interface Output {
  todos: Todo[];
}

export async function listTodos(input: Input = {}): Promise<Output> {
  const [conditionalsSQL, args] = buildWhereClause(input);

  const query = `
  SELECT *
  FROM todos
  ${conditionalsSQL};`;

  const rows = await db.any<Row>(query, args);

  const todos = rows.map(parseRow);
  return { todos };
}

function buildWhereClause(input: Input): [string, object] {
  const conditionals: string[] = [];
  if (input.ids) {
    conditionals.push(`id in ($(ids:csv))`);
  }

  if (input.boardIds) {
    conditionals.push(`board_id in ($(boardIds:csv))`);
  }

  if (conditionals.length === 0) return ['', {}];
  return [`WHERE ${conditionals.join(' AND ')}`, input];
}
