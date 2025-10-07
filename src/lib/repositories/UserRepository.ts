import database from "../../database/connection";
import {UserRegistration, UserRow} from "../../entities/Authentication";
import {STATUS} from "../../constants";


class UserRepository {

  /**
   * Método para obtener la información de la sesión de un usuario.
   * @param {string} email - El email de usuario.
   * @returns {Promise<UserRow>} - La información de la sesión del usuario.
   */
   async getInfoSessionByUser(email: string): Promise<UserRow> {

    const query = `
        SELECT
            U.id            AS "userId",
            U.name          AS "name",
            U.email         AS "email",
            U.password_hash AS "passwordHash"
        FROM usuarios U
        WHERE U.deleted_at IS NULL
          AND LOWER(U.email) = LOWER($1)
            LIMIT 1;
    `;

    const { rows } = await database.query<UserRow>(query, [email.trim()]);
    return rows[0] ?? null;
  }

  /**
   * Registro de usuario
   * @param data
   */
  async createUser(data:UserRegistration): Promise<void> {

    const query = `INSERT INTO users (name, email, password_hash, status_id)
                   SELECT $1, $2, $3, s.id
                   FROM status s
                   WHERE s.name = $4 RETURNING id, name, email, created_at;`;
    await database.query<UserRow>(query, [data.name, data.email.trim(), data.password, STATUS.ACTIVE]);
  }

  /**
   * Obtiene la información del usuario por su email.
   * @param email
   */
  async getUserInfoByEmail(email: string): Promise<UserRow> {

    const query = `
        SELECT U.id            AS "userId",
               U.name          AS "name",
               U.email         AS "email"               
        FROM users U
        WHERE U.deleted_at IS NULL
          AND LOWER(U.email) = LOWER($1) LIMIT 1;
    `;

    const {rows} = await database.query<UserRow>(query, [email.trim()]);
    return rows[0] ?? null;
  }

}

export default new UserRepository();