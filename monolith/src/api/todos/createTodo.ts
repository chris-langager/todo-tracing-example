import { RequestHandler } from 'express';
import * as store from '../../store';
import { v4 as newId } from 'uuid';

export const createTodo: RequestHandler = async (req, res) => {
  const { boardId, text } = req.body;
  if (!boardId || !text) {
    res.statusCode = 400;
    res.json({
      code: 400,
      message: 'missing required properties',
    });
    return;
  }

  const id = newId();

  const todo = await store.upsertTodo({
    id,
    createdBy: req.user.id,
    boardId,
    text,
    completed: false,
  });

  res.json(todo);
};
