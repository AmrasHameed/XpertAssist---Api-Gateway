import { NextFunction, Request, Response } from "express";
import { StatusCode } from "../../interfaces/enum";
import { Tokens } from "../../interfaces/interface";
import { AuthService } from "./config/gRPC-client/auth.client";


export const refreshToken = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.cookies?.refreshToken ||req.headers.authorization?.trim().split(" ")[1] || req.body.token;
      if (token) {
        AuthService.RefreshToken({ token }, (err:any, result:Tokens) => {
          if (err) {
            console.log(err);
            res.status(StatusCode.NotAcceptable).json({ message: "Invalid refresh token" });
          } else {
            res
              .status(StatusCode.Created)
              .json({ success: true,token:result?.accessToken ,refreshToken:result?.refreshToken ,message: "new token generated successfully" });
          }
        });
      } else {
        res.status(StatusCode.Unauthorized).json({message: "Token is missing"});
      }
    } catch (error) {
      console.log(error);
    }
  };