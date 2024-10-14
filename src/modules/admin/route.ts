import express, { Application } from 'express'
import AdminController from './controller';
import upload from '../../middleware/multer';
import { isValidated } from '../auth/controller';


const adminRoute:Application=express()

const controller = new AdminController()

adminRoute.post('/adminLogin', controller.adminLogin);
adminRoute.post('/addService', isValidated, upload.single('image'), controller.addService)
adminRoute.get('/getServices', isValidated, controller.getServices)
adminRoute.get('/getService/:id', isValidated, controller.getService)
adminRoute.put('/updateService/:id', isValidated, upload.single('serviceImage'), controller.updateService)
adminRoute.delete('/deleteService/:id', isValidated, controller.deleteService)
adminRoute.get('/getExperts', isValidated, controller.getExperts)
adminRoute.get('/getExpert/:id', isValidated, controller.getExpert)
adminRoute.post('/expert/:id/verification', isValidated, controller.expertVerification)
adminRoute.patch('/experts/:id/block-unblock', isValidated, controller.expertBlock)
adminRoute.get('/getUsers', isValidated, controller.getUsers)
adminRoute.patch('/users/:id/block-unblock', isValidated, controller.userBlock)



export default adminRoute