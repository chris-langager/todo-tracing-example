import { RequestHandler } from 'express';
import * as store from '../../store';

export const listBoards: RequestHandler = async (req, res) => {
  const { boards } = await store.listBoards();
  res.json({ data: boards });
};
