import express, { Application } from 'express'
import expertController from './controller'
import upload from '../../middleware/multer';
import { isValidated } from '../auth/controller';

const expertRoute:Application=express()

const controller = new expertController()

expertRoute.post('/loginExpert',controller.loginExpert);
expertRoute.post('/expertSignupOtp',controller.expertSignupOtp);
expertRoute.post('/expertResendOtp',controller.expertResendOtp);
expertRoute.post('/registerExpert', upload.single('image'), controller.registerExpert);
expertRoute.post('/googleLoginExpert',controller.googleLoginExpert);
expertRoute.get('/getExpert/:id',isValidated, controller.getExpert);
expertRoute.post('/updateExpert/:id',isValidated, upload.single('expertImage'), controller.updateExpert);
expertRoute.post('/changePassword/:id', isValidated, controller.changePassword)


export default expertRoute