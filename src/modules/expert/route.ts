import express, { Application } from 'express'
import expertController from './controller'
import upload from '../../middleware/multer';

const expertRoute:Application=express()

const controller = new expertController()

expertRoute.post('/loginExpert',controller.loginExpert);
expertRoute.post('/expertSignupOtp',controller.expertSignupOtp);
expertRoute.post('/expertResendOtp',controller.expertResendOtp);
expertRoute.post('/registerExpert', upload.single('image'), controller.registerExpert);
expertRoute.post('/googleLoginExpert',controller.googleLoginExpert);

export default expertRoute