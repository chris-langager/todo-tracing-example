import { RequestHandler } from 'express';
import * as store from '../../store';

export const deleteTodo: RequestHandler = async (req, res) => {
  store.deleteTodo({ id: req.params.id });
  res.json({});
};
