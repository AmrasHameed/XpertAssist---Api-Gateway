import { Request, Response } from 'express';
import { AdminAuthResponse, Expert, Service } from '../../interfaces/interface';
import { StatusCode } from '../../interfaces/enum';
import { UserService } from '../user/config/gRPC-client/user.client';
import uploadToS3 from '../../services/s3';
import { ServiceManagement } from '../serviceManagement/config/gRPC-client/service.client';
import { ExpertService } from '../expert/config/gRPC-client/auth.expert';

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

  addService = async(req: Request, res: Response) => {
    try {
      const files: Express.Multer.File | undefined = req.file;
      let serviceImage = '';
      if (files) {
        serviceImage = await uploadToS3(files);
      }
      ServiceManagement.AddService({...req.body, serviceImage}, (err: any, result: {message: string}) => {
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

  getService = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ServiceManagement.GetService({id}, (err: any, result: { service: Service }) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'NoServicesFound' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  updateService = async (req: Request, res: Response) => {
    try {
      const files: Express.Multer.File | undefined = req.file;
      let serviceImage = '';
      if (files) {
        serviceImage = await uploadToS3(files);
      }
      const {id} = req.params
      ServiceManagement.UpdateService({...req.body,serviceImage, id}, (err: any, result: {message:string}) => {
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

  deleteService = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ServiceManagement.DeleteService({id}, (err: any, result: { message: string }) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'NoServicesFound' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };

  getExperts = async (req: Request, res: Response) => {
    try {
      ExpertService.GetExperts({}, (err: any, result: { experts: Expert[] }) => {
        if (err) {
          return res.status(StatusCode.BadRequest).json({ message: err.message });
        }
        if (result) { 
          return res.status(StatusCode.OK).json(result.experts); 
        }
        return res.status(StatusCode.NotFound).json({ message: 'NoExpertsFound' });
      });
    } catch (error) {
      console.error(error);
      return res.status(StatusCode.InternalServerError).json({ message: 'Internal Server Error' });
    }
  };
  

  getExpert  = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ExpertService.GetExpert({id}, (err: any, result: { expert: Expert}) => {
        if (err) {
          console.log(err)
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

  expertVerification = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      ExpertService.ExpertVerification({id, ...req.body}, (err: any, result: { message: string}) => {
        if (err) {
          console.log(err)
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

  expertBlock = async (req: Request, res: Response) => {
    try {
      const {id} = req.params
      const {accountStatus} = req.body
      console.log(id, accountStatus)
      ExpertService.BlockExpert({id, accountStatus}, (err: any, result: { message: string}) => {
        if (err) {
          console.log(err)
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
}