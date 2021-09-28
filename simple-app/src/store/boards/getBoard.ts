import { listBoards } from '.';
import { Board } from '../../types';

export async function getBoard(id: string): Promise<Board | null> {
  const { boards } = await listBoards({ ids: [id] });
  return boards[0] || null;
}
