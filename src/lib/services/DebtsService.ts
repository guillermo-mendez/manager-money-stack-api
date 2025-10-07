import {ResultService} from "../../entities/Result-service";
import {errorHandler, responseHandler} from 'error-handler-express-ts';
import debtsRepository from '../repositories/DebtsRepository';
import {CreateDebt, UpdateDebt} from "../../entities/Debt";


class DebtsService {
  /**
   * Get deudas
   */
  async getDebts(): Promise<ResultService> {
    try {
      const debts = await debtsRepository.getDebts();
      const payments = await debtsRepository.getPayments();
      const debtsWithPayments = debts.map(debt => {
        const debtPayments = payments.filter(payment => payment.debtId === debt.debtId);
        return {
          ...debt,
          payments: debtPayments
        };
      });

      return responseHandler(debtsWithPayments);

    } catch (err) {
      throw new errorHandler().error(err).method('getCategories').debug().build();
    }
  }

  /**
   * Get deuda por usuario
   */
  async getDebtByUser(userId: string): Promise<ResultService> {
    try {
      const debts = await debtsRepository.getDebtByUser(userId);
      const debtsIds = debts.map(debt => debt.debtId);
      const payments = await debtsRepository.getPaymentsByDebtId(debtsIds);
      const debtsWithPayments = debts.map(debt => {
        const debtPayments = payments.filter(payment => payment.debtId === debt.debtId);
        return {
          ...debt,
          payments: debtPayments
        };
      });

      return responseHandler(debtsWithPayments);

    } catch (err) {
      throw new errorHandler().error(err).method('getDebtByUser').debug().build();
    }
  }

  /**
   * Método para crear una nueva deuda.
   * @param data<CreateTask>
   * @param userId
   */
  async createDebt(data: CreateDebt, userId: string): Promise<ResultService> {
    try {

      await debtsRepository.createDebt(data, userId);

      return responseHandler({message: 'Debt created successfully'});


    } catch (err) {
      throw new errorHandler().error(err).method('CreateDebt').debug().build();
    }
  }

  /**
   * Método para actualizar una deuda.
   * @param data<UpdateDebt>
   * @param debtId
   */
  async updateDebt(data: UpdateDebt, debtId: string): Promise<ResultService> {
    try {

      await debtsRepository.updateDebt(data, debtId);

      return responseHandler({message: 'Debt updated successfully'});

    } catch (err) {
      throw new errorHandler().error(err).method('updateDebt').debug().build();
    }
  }

  /**
   * Método para eliminar una deuda.
   * @param debtId
   */
  async deleteDebt(debtId: string): Promise<ResultService> {
    try {

      await debtsRepository.deleteDebt(debtId);

      return responseHandler({message: 'Debt deleted successfully'});


    } catch (err) {
      throw new errorHandler().error(err).method('deleteCategory').debug().build();
    }
  }

}

export default new DebtsService();