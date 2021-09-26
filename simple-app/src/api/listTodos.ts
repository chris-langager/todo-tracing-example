import { RequestHandler } from 'express';
import * as store from '../store';

export const listTodos: RequestHandler = async (req, res) => {
  const { todos } = await store.listTodos();
  res.json({ data: todos });
};
