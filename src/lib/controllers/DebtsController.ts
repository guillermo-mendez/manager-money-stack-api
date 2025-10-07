import {Request, Response} from 'express';
import debtsService from "../services/DebtsService";
import validation from '../../validators/DebtsValidator';

class DebtsController {
  /**
   * Obtener todas las deudas
   * @param req
   * @param res
   */
  async getDebts(req: Request, res: Response): Promise<Response> {
    const result = await debtsService.getDebts();
    return res.json(result);
  }

 /**
   * Obtener deuda por usuario
   * @param req
   * @param res
   */
  async getDebtByUser(req: Request, res: Response): Promise<Response> {
    validation.getDebtByUserValidation(req.params);
    const userId = req.params.userId;
    const result = await debtsService.getDebtByUser(userId);
    return res.json(result);
  }

  /**
   * Crear nueva deuda
   * @param req
   * @param res
   */
  async createDebt(req: Request, res: Response): Promise<Response> {
    validation.createDebtValidation(req.body);
    const userId = req.user?.userId;
    const result = await debtsService.createDebt(req.body, userId);
    return res.json(result);
  }

  /**
   * Actualizar deuda
   * @param req
   * @param res
   */
  async updateDebt(req: Request, res: Response): Promise<Response> {
    const debtId = req.params.id;
    validation.updateDebtValidation({...req.body,debtId});
    const result = await debtsService.updateDebt(req.body, debtId);
    return res.json(result);
  }

  /**
   * Eliminar deuda
   * @param req
   * @param res
   */
  async deleteDebt(req: Request, res: Response): Promise<Response> {
    const debtId = req.params.id;
    validation.eliminarDebtValidation({debtId});
    const result = await debtsService.deleteDebt(debtId);
    return res.json(result);
  }

}

export default new DebtsController();