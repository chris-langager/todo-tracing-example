import { Board } from '../../types';

export interface Row {
  id: string;
  date_created: string;
  date_updated: string;
  created_by: string;
  name: string;
}

export function parseRow(row: Row): Board {
  return {
    id: row.id,
    createdBy: row.created_by,
    name: row.name,
  };
}
