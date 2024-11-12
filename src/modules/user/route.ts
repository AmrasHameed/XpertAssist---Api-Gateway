import express, { Application } from 'express';
import userController from './controller';
import upload from '../../middleware/multer';
import { isValidated } from '../auth/controller';

const userRoute: Application = express();

const controller = new userController();

userRoute.post('/loginUser', controller.loginUser);
userRoute.post('/signupOtp', controller.signupOtp);
userRoute.post('/resendOtp', controller.resendOtp);
userRoute.post('/forgotPassOtp', controller.forgotPassOtp);
userRoute.post('/otpVerify', controller.otpVerify);
userRoute.post('/updatePassword', controller.updatePassword);

userRoute.post('/registerUser', upload.single('image'), controller.registerUser);
userRoute.post('/googleLoginUser', controller.googleLoginUser);
userRoute.get('/getServices', controller.getServices)
userRoute.get('/getUser/:id', isValidated, controller.getUser)
userRoute.post('/updateProfile/:id', isValidated, upload.single('userImage'), controller.updateUser)
userRoute.post('/changePassword/:id', isValidated, controller.changePassword)
userRoute.get('/isBlocked/:id', controller.isBlocked)

userRoute.post('/sendServiceRequest', isValidated, controller.sendServiceRequest)
userRoute.get('/jobdata/:id', isValidated, controller.getJobData)
userRoute.get('/getexpert/:id', isValidated, controller.getExpert)
userRoute.get('/previousJobsUser/:id', isValidated, controller.previousJobsUser)


userRoute.post('/payment/:id', isValidated, controller.payment)
userRoute.post('/paymentSuccess/:id', isValidated, controller.paymentSuccess)


export default userRoute;
