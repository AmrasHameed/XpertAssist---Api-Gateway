import { Request, Response } from 'express';
import { AuthResponse, Service, UpdateUser, User } from '../../interfaces/interface';
import { StatusCode } from '../../interfaces/enum';
import { UserService } from './config/gRPC-client/user.client';
import uploadToS3 from '../../services/s3';
import { ServiceManagement } from '../serviceManagement/config/gRPC-client/service.client';

export default class userController {
  loginUser = (req: Request, res: Response) => {
    try {
      UserService.LoginUser(req.body, (err: any, result: AuthResponse) => {
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

  signupOtp = async (req: Request, res: Response) => {
    try {
      UserService.SignupOtp(
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
  };

  resendOtp = async (req: Request, res: Response) => {
    try {
      UserService.ResendOtp(
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
  };

  registerUser = async (req: Request, res: Response) => {
    try {
      const files: Express.Multer.File | undefined = req.file;
      let userImage = '';
      if (files) {
        userImage = await uploadToS3(files);
      }
      UserService.RegisterUser(
        { ...req.body,userImage },
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

  googleLoginUser = (req: Request, res: Response) => {
    try {
      UserService.GoogleLoginUser(
        req.body,
        (err: any, result: AuthResponse) => {
          if (err) {
            console.log(err);
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

  getServices = async (req: Request, res: Response) => {
    try {
      ServiceManagement.GetServices({}, (err: any, result: { services: Service[] }) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result.services); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'NoServicesFound' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };


  getUser = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      UserService.GetUser({id}, (err: any, result: { user: User}) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'UserNotFound' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };


  updateUser = async (req: Request, res: Response) => {
    try {
      const files: Express.Multer.File | undefined = req.file;
      let userImage = '';
      if (files) {
        userImage = await uploadToS3(files);
      }
      const {id} = req.params
      UserService.UpdateUser({...req.body,userImage, id}, (err: any, result: {user: UpdateUser}) => {
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

  changePassword = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      const {currentPassword, newPassword} = req.body
      UserService.ChangePassword({id, currentPassword, newPassword}, (err: any, result: { message: string}) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'UserNotFound' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  isBlocked = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      UserService.IsBlocked({id}, (err: any, result: { message: string}) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'UserNotFound' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  forgotPassOtp = async (req: Request, res: Response) => {
    try {
      UserService.ForgotPassOtp(
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
  };

  otpVerify = async (req: Request, res: Response) => {
    try {
      UserService.OtpVerify(
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
  };

  updatePassword = async (req: Request, res: Response) => {
    try {
      UserService.UpdatePassword(
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
  };
}
