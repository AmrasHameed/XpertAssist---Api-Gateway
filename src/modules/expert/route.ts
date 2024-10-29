import express, { Application } from 'express'
import expertController from './controller'
import upload from '../../middleware/multer';
import { isValidated } from '../auth/controller';

const expertRoute:Application=express()

const controller = new expertController()

expertRoute.post('/loginExpert',controller.loginExpert);
expertRoute.post('/expertSignupOtp',controller.expertSignupOtp);
expertRoute.post('/expertResendOtp',controller.expertResendOtp);
expertRoute.post('/forgotPassOtp',controller.forgotPassOtp);
expertRoute.post('/otpVerify',controller.otpVerify);
expertRoute.post('/updatePassword',controller.updatePassword);
expertRoute.post('/registerExpert', upload.single('image'), controller.registerExpert);
expertRoute.post('/googleLoginExpert',controller.googleLoginExpert);
expertRoute.get('/getExpert/:id',isValidated, controller.getExpert);
expertRoute.post('/updateExpert/:id',isValidated, upload.single('expertImage'), controller.updateExpert);
expertRoute.post('/changePassword/:id', isValidated, controller.changePassword)
expertRoute.post('/verifyExpert/:id', isValidated,upload.single('document'), controller.verifyExpert)
expertRoute.get('/isBlocked/:id', controller.isBlocked)
expertRoute.get('/getServices',isValidated,controller.getServices)
expertRoute.post('/setOnline/:id',isValidated,controller.setOnline)
expertRoute.post('/setOffline/:id',isValidated,controller.setOffline)

expertRoute.get('/jobdata/:id', isValidated, controller.getJobData)
expertRoute.get('/getUser/:id', isValidated, controller.getUser)





export default expertRoute