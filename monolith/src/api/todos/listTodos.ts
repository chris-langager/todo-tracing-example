import { RequestHandler } from 'express';
import * as store from '../../store';

export const listTodos: RequestHandler = async (req, res) => {
  const boardId = req.query.boardId as string;
  const { todos } = await store.listTodos({ boardIds: boardId && [boardId] });
  res.json({ data: todos });
};
