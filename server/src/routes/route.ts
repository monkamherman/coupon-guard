import { Router } from "express";
import userController from "../controllers/controllers";

const user = Router()


user.post('/sendMails', userController.sendMails)


export default user 