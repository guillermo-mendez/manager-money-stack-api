import {ResultService} from "../../entities/Result-service";
import {errorHandler, responseHandler} from 'error-handler-express-ts';
import bcrypt from 'bcryptjs';
import userRepository from '../repositories/UserRepository';
import jwtService from '../../security/JWTService';
import {BCRYPT_SALT_ROUNDS, STATUSES} from '../../constants';
import {UserAuth, UserRegistration} from "../../entities/Authentication";

class UserService {
  /**
   * Registro de usuario
   * @param data
   */
  async createUser(data: UserRegistration): Promise<ResultService> {
    try {
      const {password} = data;
      data.password = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);
      await userRepository.createUser(data);

      return responseHandler('Usuario registrado correctamente');

    } catch (err) {
      throw new errorHandler().error(err).method('userRegistration').debug(data).build();
    }
  }

   /**
   * Método para obtener el perfil del usuario.
   * @param user
   */
  async getUserProfile(user:UserAuth) {
    try {
      const userInfo = await userRepository.getUserInfoByEmail(user.email);

      return responseHandler(userInfo);

    } catch (err) {
      throw new errorHandler().error(err).method('getUserProfile').debug(user).build();
    }
  }

}

export default new UserService();