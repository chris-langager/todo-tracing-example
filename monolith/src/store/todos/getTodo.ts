import { listTodos } from '.';
import { Todo } from '../../types';

export async function getTodo(id: string): Promise<Todo | null> {
  const { todos } = await listTodos({ ids: [id] });
  return todos[0] || null;
}
