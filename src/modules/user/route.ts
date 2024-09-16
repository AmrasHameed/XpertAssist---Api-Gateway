import express, { Application } from 'express'
import userController from './controller'
import upload from '../../middleware/multer';

const userRoute:Application=express()

const controller = new userController()

userRoute.post('/loginUser',controller.loginUser);
userRoute.post('/registerUser', upload.single('image'), controller.registerUser);

export default userRoute