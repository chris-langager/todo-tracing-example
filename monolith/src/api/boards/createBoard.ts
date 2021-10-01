import { RequestHandler } from 'express';
import * as store from '../../store';
import { v4 as newId } from 'uuid';

export const createBoard: RequestHandler = async (req, res) => {
  const { name } = req.body;

  const id = newId();

  const board = await store.upsertBoard({
    id,
    createdBy: req.user.id,
    name,
  });
  res.json(board);
};
