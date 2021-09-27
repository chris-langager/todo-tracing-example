import { RequestHandler } from 'express';
import * as store from '../../store';

export const listUsers: RequestHandler = async (req, res) => {
  const ids = (req.query.ids as string)?.split(',');
  const { users } = await store.listUsers({ ids });
  res.json({ data: users });
};
