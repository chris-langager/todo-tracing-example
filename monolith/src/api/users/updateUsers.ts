import { RequestHandler } from 'express';
import * as store from '../../store';

export const updateUser: RequestHandler = async (req, res) => {
  const { id, name } = req.body;
  const user = await store.getUser(id);
  if (!user) {
    res.json({ code: 404, message: `could not find user with id "${id}"` });
  }

  const updatedUser = await store.upsertUser({ ...user, name });
  res.json(updatedUser);
};
