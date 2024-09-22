import express, { Application } from 'express'
import AdminController from './controller';


const adminRoute:Application=express()

const controller = new AdminController()

adminRoute.post('/adminLogin',controller.adminLogin);

export default adminRoute