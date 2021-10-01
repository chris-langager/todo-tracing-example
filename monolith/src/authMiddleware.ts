import { RequestHandler } from 'express';
import { v4 as newId } from 'uuid';
import * as jwt from 'jsonwebtoken';
import * as store from './store';
import { ENV } from './env';
import { User } from './types';

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}

export const authMiddleware: RequestHandler = async (req, res, next) => {
  const { token } = req.cookies;

  let user = await getUserFromToken(token);

  if (!user) {
    user = await store.upsertUser({
      id: newId(),
      name: 'anonymous',
    });
  }

  const updatedToken = await newToken(user);
  res.cookie('token', updatedToken, {
    httpOnly: true,
    expires: new Date('01 12 2050'),
  });

  req.user = user;
  next();
};

async function newToken(user: User): Promise<string> {
  return new Promise((resolve, reject) => {
    jwt.sign(user, ENV.JWT_SECRET, (err, token) => {
      if (err) {
        reject(err);
      } else {
        resolve(token);
      }
    });
  });
}

async function getUserFromToken(token: string): Promise<User> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, ENV.JWT_SECRET, async (err, payload) => {
      if (err) {
        reject(err);
      } else {
        console.log({ payload });
        const user = await store.getUser(payload.id);
        resolve(user);
      }
    });
  });
}
