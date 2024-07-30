import express from 'express';
import userAuth from '../middlewares/authMiddleware.js';
import { getUserController, updateUserController } from '../controllers/userController.js';

const router = express.Router();   
//get user data

router.post('/getUser',userAuth);

router.put('/update-user', userAuth, getUserController);

export default router;
