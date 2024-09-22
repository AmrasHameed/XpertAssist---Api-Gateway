import { Request, Response } from 'express';
import { AuthResponse } from '../../interfaces/interface';
import { StatusCode } from '../../interfaces/enum';
import uploadToS3 from '../../services/s3';
import { ExpertService } from './config/gRPC-client/auth.expert';

export default class expertController {
  loginExpert = (req: Request, res: Response) => {
    try {
      ExpertService.LoginExpert(req.body, (err: any, result: AuthResponse) => {
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

  expertSignupOtp = async (req: Request, res: Response) => {
    try {
      ExpertService.ExpertSignupOtp(
        req.body,
        (err: any, result: { message: string }) => {
          if (err) {
            res.status(StatusCode.BadRequest).json({ message: err });
          } else {
            res.status(StatusCode.Created).json(result);
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  }

  expertResendOtp = async (req: Request, res: Response) => {
    try {
      ExpertService.ExpertResendOtp(
        req.body,
        (err: any, result: { message: string }) => {
          if (err) {
            res.status(StatusCode.BadRequest).json({ message: err });
          } else {
            res.status(StatusCode.Created).json(result);
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  }

  registerExpert = async(req: Request, res: Response) => {
    try {
      const files: Express.Multer.File | undefined = req.file;
      let expertImage = '';
      if (files) {
        expertImage = await uploadToS3(files);
      }
      ExpertService.RegisterExpert(
        { ...req.body, expertImage },
        (err: any, result: AuthResponse) => {
          if (err) {
            res.status(StatusCode.BadRequest).json({ message: err });
          } else {
            res.status(StatusCode.Created).json(result);
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };

  googleLoginExpert = (req: Request, res: Response) => {
    try {
      ExpertService.GoogleLoginExpert(
        req.body,
        (err: any, result: AuthResponse) => {
          if (err) {
            console.log(err);
            res.status(StatusCode.BadRequest).json({ message: err });
          } else {
            console.log('result ', result);
            res.status(StatusCode.Created).json(result);
          }
        }
      );
    } catch (error) {
      console.log(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };
}
