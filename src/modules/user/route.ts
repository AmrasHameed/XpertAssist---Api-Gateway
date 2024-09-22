import express, { Application } from 'express';
import userController from './controller';
import upload from '../../middleware/multer';

const userRoute: Application = express();

const controller = new userController();

userRoute.post('/loginUser', controller.loginUser);
userRoute.post('/signupOtp', controller.signupOtp);
userRoute.post('/resendOtp', controller.resendOtp);
userRoute.post('/registerUser', upload.single('image'), controller.registerUser);
userRoute.post('/googleLoginUser', controller.googleLoginUser);

export default userRoute;
