import { RequestHandler } from 'express';
import * as store from '../../store';

export const updateBoard: RequestHandler = async (req, res) => {
  const { id, name } = req.body;
  const board = await store.getBoard(id);
  if (!board) {
    res.json({ code: 404, message: `could not find board with id "${id}"` });
  }

  const updatedBoard = store.upsertBoard({ ...board, name });
  res.json(updatedBoard);
};
