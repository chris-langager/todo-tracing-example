import { RequestHandler } from 'express';
import * as store from '../../store';
import { v4 as newId } from 'uuid';

export const createTodo: RequestHandler = async (req, res) => {
  const data = req.body;
  if (!data.text) {
    res.statusCode = 400;
    res.json({
      code: 400,
      message: 'missing required property "text"',
    });
    return;
  }

  const id = newId();

  const todo = await store.upsertTodo({
    id,
    createdBy: 'e687f45a-1bec-429a-bb51-caa5aa505b87',
    boardId: '60748e3f-9118-49f5-b650-9f98855cd0ba',
    text: data.text,
    completed: false,
  });
  res.json(todo);
};
