import { Request, Response } from 'express';
import { AggregationResponse, AuthResponse, Expert, Job, Service, UpdateExpert, User, WalletDataResponse } from '../../interfaces/interface';
import { StatusCode } from '../../interfaces/enum';
import uploadToS3 from '../../services/s3';
import { ExpertService } from './config/gRPC-client/auth.expert';
import { ServiceManagement } from '../serviceManagement/config/gRPC-client/service.client';
import { UserService } from '../user/config/gRPC-client/user.client';

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

  forgotPassOtp = async (req: Request, res: Response) => {
    try {
      ExpertService.ForgotPassOtp(
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
      ExpertService.OtpVerify(
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
      ExpertService.UpdatePassword(
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

  getExpert = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ExpertService.GetExpert({id}, (err: any, result: { expert: Expert}) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          console.log(result)
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'UserNotFound' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  updateExpert  = async (req: Request, res: Response) => {
    try {
      const files: Express.Multer.File | undefined = req.file;
      let expertImage = '';
      if (files) {
        expertImage = await uploadToS3(files);
      }
      const {id} = req.params
      ExpertService.UpdateExpert({...req.body,expertImage, id}, (err: any, result: {expert: UpdateExpert}) => {
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
      ExpertService.ChangePassword({id, currentPassword, newPassword}, (err: any, result: { message: string}) => {
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

  verifyExpert = async (req: Request, res: Response) => {
    try {
      const files: Express.Multer.File | undefined = req.file;
      let verifyDocument = '';
      if (files) {
        verifyDocument = await uploadToS3(files);
      }
      const {id} = req.params
      ExpertService.VerifyExpert({...req.body,verifyDocument, id}, (err: any, result: {message:string, isVerified:string}) => {
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
  }

  isBlocked =async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ExpertService.IsBlocked({id}, (err: any, result: { message: string}) => {
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

  setOnline =async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      ExpertService.SetOnline({id}, (err: any, result: { message: string}) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'User Not Found' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  setOffline =async (req: Request, res: Response) => {
    try {
      const {id} = req.params;
      ExpertService.SetOffline({id}, (err: any, result: { message: string}) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'User Not Found' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  getJobData = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ServiceManagement.GetJobData({id}, (err: any, result: { job: Job}) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'Job Not Found' });
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

  getExpertDetails = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ExpertService.GetExpertDetails({id}, (err: any, result: {expert: Expert}) => {
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

  getExpertDashboard = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ServiceManagement.GetExpertDashboard({id}, (err: any, result: AggregationResponse) => {
        console.log(err)
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'Job Not Found' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  }; 

  previousJobs = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ServiceManagement.PreviousJobs({id}, async (err: any, result:{jobs: Job[]}) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result && result.jobs.length > 0) { 
          try {
            const jobsWithUserDetails = await Promise.all(
              result.jobs.map((job) => 
                new Promise((resolve, reject) => {
                  UserService.GetUser({ id: job.userId }, (userError: any,  res: { user: User }) => {
                    if (userError) {
                      console.error('Error fetching user details:', userError);
                      return reject(userError);
                    }
                    resolve({
                      ...job,
                      userDetails: res,
                    });
                  });
                })
              )
            );
            console.log(jobsWithUserDetails)
            return res.status(StatusCode.OK).json({ jobs: jobsWithUserDetails });
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


  walletData = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ExpertService.GetWalletData({id}, (err: any, result: WalletDataResponse) => {
        console.log(err)
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'Expert Not Found' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  }; 

  withdraw = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      const {amount} = req.body
      ExpertService.Withdraw({id, amount}, (err: any, result: {message: string}) => {
        console.log(err)
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'Expert Not Found' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  }; 
}
