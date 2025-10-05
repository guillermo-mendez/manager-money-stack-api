import {Request, Response} from 'express';
import userService from "../services/UserService";
import validation from '../../validators/AuthValidator';

class UserController {
  /**
   * Registro de usuario
   * @param req
   * @param res
   */
  async createUser(req: Request, res: Response): Promise<Response> {
    validation.userRegistrationValidation(req.body);
    const result = await userService.createUser(req.body);
    return res.json(result);
  }

  /**
   * Obtener perfil de usuario
   * @param req
   * @param res
   */
  async getUserProfile(req: Request, res: Response): Promise<Response> {
   const user = req.user;
   if (!user) {
      return res.status(401).json({message: 'No autorizado'});
    }
    const result = await userService.getUserProfile(user);
    return res.json(result);
  }

}

export default new UserController();