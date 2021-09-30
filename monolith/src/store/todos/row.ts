import { Todo } from '../../types';

export interface Row {
  id: string;
  date_created: string;
  date_updated: string;
  created_by: string;
  board_id: string;
  text: string;
  completed: boolean;
}

export function parseRow(row: Row): Todo {
  return {
    id: row.id,
    dateCreated: row.date_created,
    dateUpdated: row.date_updated,
    createdBy: row.created_by,
    boardId: row.board_id,
    text: row.text,
    completed: row.completed,
  };
}
