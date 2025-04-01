import { Router } from "express";
import userController from "../controllers/controllers";

const user = Router()


user.post('/sendMails', async (req, res, next) => {
	try {
		await userController.sendMails(req, res, next);
	} catch (error) {
		next(error);
	}
});


export default user 