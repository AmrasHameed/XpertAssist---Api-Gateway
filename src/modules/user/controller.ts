import { Request, Response } from 'express';
import {
  AuthResponse,
  Expert,
  Job,
  Service,
  UpdateUser,
  User,
} from '../../interfaces/interface';
import { StatusCode } from '../../interfaces/enum';
import { UserService } from './config/gRPC-client/user.client';
import uploadToS3 from '../../services/s3';
import { ServiceManagement } from '../serviceManagement/config/gRPC-client/service.client';
import { ExpertService } from '../expert/config/gRPC-client/auth.expert';
import Razorpay from 'razorpay';

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
        { ...req.body, userImage },
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
      ServiceManagement.GetServices(
        {},
        (err: any, result: { services: Service[] }) => {
          if (err) {
            return res
              .status(StatusCode.BadRequest)
              .json({ message: err.message });
          }
          if (result) {
            return res.status(StatusCode.OK).json(result.services);
          }
          return res
            .status(StatusCode.NotFound)
            .json({ message: 'NoServicesFound' });
        }
      );
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };

  getUser = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      UserService.GetUser({ id }, (err: any, result: { user: User }) => {
        if (err) {
          return res
            .status(StatusCode.BadRequest)
            .json({ message: err.message });
        }
        if (result) {
          return res.status(StatusCode.OK).json(result);
        }
        return res
          .status(StatusCode.NotFound)
          .json({ message: 'UserNotFound' });
      });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const files: Express.Multer.File | undefined = req.file;
      let userImage = '';
      if (files) {
        userImage = await uploadToS3(files);
      }
      const { id } = req.params;
      UserService.UpdateUser(
        { ...req.body, userImage, id },
        (err: any, result: { user: UpdateUser }) => {
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

  changePassword = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { currentPassword, newPassword } = req.body;
      UserService.ChangePassword(
        { id, currentPassword, newPassword },
        (err: any, result: { message: string }) => {
          if (err) {
            return res
              .status(StatusCode.BadRequest)
              .json({ message: err.message });
          }
          if (result) {
            return res.status(StatusCode.OK).json(result);
          }
          return res
            .status(StatusCode.NotFound)
            .json({ message: 'UserNotFound' });
        }
      );
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };

  isBlocked = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      UserService.IsBlocked({ id }, (err: any, result: { message: string }) => {
        if (err) {
          return res
            .status(StatusCode.BadRequest)
            .json({ message: err.message });
        }
        if (result) {
          return res.status(StatusCode.OK).json(result);
        }
        return res
          .status(StatusCode.NotFound)
          .json({ message: 'UserNotFound' });
      });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
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

  sendServiceRequest = async (req: Request, res: Response) => {
    try {
      ExpertService.SendServiceRequest(
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

  getJobData = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      ServiceManagement.GetJobData({ id }, (err: any, result: { job: Job }) => {
        if (err) {
          return res
            .status(StatusCode.BadRequest)
            .json({ message: err.message });
        }
        if (result) {
          return res.status(StatusCode.OK).json(result);
        }
        return res
          .status(StatusCode.NotFound)
          .json({ message: 'Job Not Found' });
      });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };

  getExpert = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      ExpertService.GetExpert(
        { id },
        (err: any, result: { expert: Expert }) => {
          if (err) {
            return res
              .status(StatusCode.BadRequest)
              .json({ message: err.message });
          }
          if (result) {
            return res.status(StatusCode.OK).json(result);
          }
          return res
            .status(StatusCode.NotFound)
            .json({ message: 'UserNotFound' });
        }
      );
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };

  payment = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      const instance = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID || 'rzp_test_IjovpkTeb85bN5',
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });
      const options = {
        amount:parseInt(amount, 10),
        currency: 'INR',
        receipt: 'order_' + id,
      };
      const order = await instance.orders.create(options);
      if (!order)
        return res
          .status(StatusCode.InternalServerError)
          .json({ message: 'Internal Server Error' });
      res.json(order);
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };

  paymentSuccess = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { amount, paymentType } = req.body;
      ServiceManagement.PaymentSuccess({ id, amount, paymentType }, (err: any, result: { message: string }) => {
        if (err) {
          return res
            .status(StatusCode.BadRequest)
            .json({ message: err.message });
        }
        if (result) {
          return res.status(StatusCode.OK).json(result);
        }
        return res
          .status(StatusCode.NotFound)
          .json({ message: 'Job Not Found' });
      });
    } catch (error) {
      console.error(error);
      return res
        .status(StatusCode.InternalServerError)
        .json({ message: 'Internal Server Error' });
    }
  };

  previousJobsUser = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ServiceManagement.PreviousJobsUser({id}, async (err: any, result:{jobs: Job[]}) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result && result.jobs.length > 0) { 
          try {
            const jobsWithExpertDetails = await Promise.all(
              result.jobs.map((job) => 
                new Promise((resolve, reject) => {
                  ExpertService.GetExpert({ id: job.expertId }, (userError: any,  res: { expert: Expert }) => {
                    if (userError) {
                      console.error('Error fetching user details:', userError);
                      return reject(userError);
                    }
                    resolve({
                      ...job,
                      expertDetails: res,
                    });
                  });
                })
              )
            );
            return res.status(StatusCode.OK).json({ jobs: jobsWithExpertDetails });
          } catch (userError) {
            console.error('Error fetching user details:', userError);
            return res.status(StatusCode.InternalServerError).json({ message: 'Error fetching user details' });
          }
        }
        return res.status(StatusCode.NotFound).json({ message: 'Job Not Found' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  }; 
}
