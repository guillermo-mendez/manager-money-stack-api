import {ResultService} from "../../entities/Result-service";
import {errorHandler, responseHandler} from 'error-handler-express-ts';
import debtsRepository from '../repositories/DebtsRepository';
import {UserAuth} from "../../entities/Authentication";
import {CreateCategory, UpdateCategory} from "../../entities/Categories";

class DebtsService {
  /**
   * Get categories for the authenticated user
   * @param user
   */
  async getCategories(user: UserAuth): Promise<ResultService> {
    try {
      const userId = user.userId;

      const tasks = await debtsRepository.getCategories(userId);

      return responseHandler(tasks);

    } catch (err) {
      throw new errorHandler().error(err).method('getCategories').debug().build();
    }
  }

  /**
   * Método para crear una nueva categoria.
   * @param data<CreateTask>
   * @param userId
   */
  async createCategory(data:CreateCategory, userId: string): Promise<ResultService> {
    try {

      await debtsRepository.createCategory(data,userId);
      const tasks = await debtsRepository.getCategories(userId);

        return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('createCategory').debug().build();
    }
  }

  /**
   * Método para actualizar una categoria.
   * @param data<UpdateCategory>
   * @param categoryId
   * @param userId
   */
  async updateCategory(data:UpdateCategory, categoryId:string, userId: string): Promise<ResultService> {
    try {

      await debtsRepository.updateCategory(data,categoryId,userId);
      const tasks = await debtsRepository.getCategories(userId);

      return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('updateCategory').debug().build();
    }
  }

  /**
   * Método para eliminar una categoria.
   * @param categoryId
   * @param userId
   */
  async deleteCategory(categoryId:string, userId: string): Promise<ResultService> {
    try {

      await debtsRepository.deleteCategory(categoryId,userId);
      const tasks = await debtsRepository.getCategories(userId);

      return responseHandler(tasks);


    } catch (err) {
      throw new errorHandler().error(err).method('deleteCategory').debug().build();
    }
  }

}

export default new DebtsService();