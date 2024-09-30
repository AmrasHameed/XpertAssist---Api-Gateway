import { NextFunction, Request, Response } from 'express';
import { StatusCode } from '../../interfaces/enum';
import { Tokens, UserCredentials } from '../../interfaces/interface';
import { AuthService } from './config/gRPC-client/auth.client';
import AsyncHandler from "express-async-handler";



export const isValidated = AsyncHandler(
  (req: Request, res: Response, next: NextFunction) => {
    try {  
      const token = req.cookies?.token || req.headers.authorization?.trim().split(" ")[1];  
      AuthService.IsAuthenticated({ token }, (err:any, result:UserCredentials) => {
        if (err) {
          console.log(err);
          res.status(StatusCode.Unauthorized).json({ success: false, message: err });
        } else {
          next();
        }
      });
    } catch (error) {
      console.log(error);
    }
  }
);


export const refreshToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.refreshToken ||
      req.headers.authorization?.trim().split(' ')[1] ||
      req.body.token;
    if (token) {
      AuthService.RefreshToken({ token }, (err: any, result: Tokens) => {
        if (err) {
          console.log(err);
          res
            .status(StatusCode.NotAcceptable)
            .json({ message: 'Invalid refresh token' });
        } else { 
          res
            .status(StatusCode.Created)
            .json({
              success: true,
              accesstoken: result?.access_token,
              refreshToken: result?.refresh_token,
              message: 'new token generated successfully',
            });
        }
      });
    } else {
      res.status(StatusCode.Unauthorized).json({ message: 'Token is missing' });
    }
  } catch (error) {
    console.log(error);
  }
};
