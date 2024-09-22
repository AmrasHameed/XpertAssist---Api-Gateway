import { Request, Response } from 'express';
import { AdminAuthResponse } from '../../interfaces/interface';
import { StatusCode } from '../../interfaces/enum';
import { UserService } from '../user/config/gRPC-client/user.client';

export default class AdminController {
  adminLogin = (req: Request, res: Response) => {
    try {
      UserService.AdminLogin(req.body, (err: any, result: AdminAuthResponse) => {
        if (err) {
          res.status(StatusCode.BadRequest).json({ message: err });
        } else {
          res.status(StatusCode.Created).json(result);
        }
      });
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };
}