import { Request, Response } from 'express';
import { User } from '../user/entity';

export interface Context {
  req: Request;
  res: Response;
  currentUser?: User;
}

export const context = ({ req, res }: { req: Request; res: Response }) => {
  return {
    req,
    res,
  };
};
