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

export default adminRoute