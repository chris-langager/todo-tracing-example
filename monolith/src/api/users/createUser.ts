import { RequestHandler } from 'express';
import * as store from '../../store';
import { v4 as newId } from 'uuid';

export const createUser: RequestHandler = async (req, res) => {
  const { name = 'anonymous' } = req.body;

  const id = newId();

  const user = await store.upsertUser({
    id,
    name,
  });
  res.json(user);
};
