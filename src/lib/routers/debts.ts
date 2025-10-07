import { Router } from 'express';
import debtsController from '../controllers/DebtsController';
import { catchAsync } from 'error-handler-express-ts';
const router = Router();

router.get('/', catchAsync(debtsController.getDebts)); // Obtener todas las deudas
router.get('/:userId', catchAsync(debtsController.getDebtByUser)); // Obtener deuda por usuario
router.post('/', catchAsync(debtsController.createDebt)); // Crear nueva deuda
router.put('/:id', catchAsync(debtsController.updateDebt)); // Actualizar deuda
router.delete('/:id', catchAsync(debtsController.deleteDebt)); // Eliminar deuda


export default router;