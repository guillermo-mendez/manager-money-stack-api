import { Router } from 'express';
import userController from '../controllers/UserController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/perfil', catchAsync(userController.getUserProfile));
router.post('/create', catchAsync(userController.createUser));

export default router;