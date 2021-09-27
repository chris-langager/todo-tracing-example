import { RequestHandler } from 'express';
import * as store from '../../store';

export const updateTodo: RequestHandler = async (req, res) => {
  const id = req.params.id;
  const { text, completed } = req.body;
  const todo = await store.getTodo(id);
  if (!todo) {
    res.json({ code: 404, message: `could not find todo with id "${id}"` });
  }

  const updatedTodo = store.upsertTodo({ ...todo, text, completed });
  res.json(updatedTodo);
};
