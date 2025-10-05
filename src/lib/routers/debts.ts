import { Router } from 'express';
import debtsController from '../controllers/DebtsController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/', catchAsync(debtsController.getCategories)); // Obtener todas las categoria del usuario autenticado
router.post('/', catchAsync(debtsController.createCategory)); // Crear nueva categoria
router.put('/:id', catchAsync(debtsController.updateCategory)); // Actualizar categoria
router.delete('/:id', catchAsync(debtsController.deleteCategory)); // Eliminar categoria


export default router;