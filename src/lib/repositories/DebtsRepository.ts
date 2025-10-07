import database from "../../database/connection";
import {CreateDebt, GetDebt, GetPayment, UpdateDebt} from "../../entities/Debt";
import {STATUS} from "../../constants";


class DebtsRepository {

  /**
   * Obtiene las deudas
   */
   async getDebts(): Promise<GetDebt[]> {

    const query = `SELECT
                       d.id AS "debtId", d.creditor_id AS "creditorId", d.debtor_id AS "debtorId", d.amount, d.description, d.created_at AS "createdAt",
                       d.updated_at AS "updatedAt",
                       c.name AS "creditorName",
                       de.name AS "debtorName",
                       c.email AS "creditorEmail",
                       de.email AS "debtorEmail",
                       s.name AS status,
                       COALESCE(SUM(p.amount), 0) AS "totalPaid",
                       (d.amount - COALESCE(SUM(p.amount), 0)) AS remaining
                   FROM debts d
                            JOIN users c  ON c.id  = d.creditor_id
                            JOIN users de ON de.id = d.debtor_id
                            JOIN status s ON s.id = d.status_id
                            LEFT JOIN payments p ON p.debt_id = d.id
                   WHERE d.deleted_at IS NULL
                   GROUP BY d.id, c.email, c.name, de.name, de.email, s.name;`;

    const { rows } = await database.query(query);
    return rows;
  }

  /**
   * Obtiene las deudas
   */
   async getPayments(): Promise<GetPayment[]> {

    const query = `SELECT
                       p.id AS "paymentId", p.debt_id AS "debtId", p.payer_id AS "payerId", p.amount, p.note, p.created_at AS "createdAt",
                       p.updated_at AS "updatedAt",
                       pe.name AS "userPaymentName",
                       pe.email AS "userPaymentEmail"
                   FROM payments p
                            JOIN users pe ON pe.id = P.payer_id
                   WHERE pe.deleted_at IS NULL
                   GROUP BY p.id, pe.email, pe.name;`;

    const { rows } = await database.query(query);
    return rows;
  }

  /**
   * Obtiene la deuda por debtId
   */
  async getPaymentsByDebtId(debtsIds: string[]): Promise<GetPayment[]> {
    console.log({debtsIds});
    const query = `SELECT
                       p.id AS "paymentId", p.debt_id AS "debtId", p.payer_id AS "payerId", p.amount, p.note, p.created_at AS "createdAt",
                       p.updated_at AS "updatedAt",
                       pe.name AS "userPaymentName",
                       pe.email AS "userPaymentEmail"
                   FROM payments p
                            JOIN users pe ON pe.id = P.payer_id
                   WHERE p.debt_id = ANY($1::uuid[]) AND pe.deleted_at IS NULL
                   GROUP BY p.id, pe.email, pe.name;`;

    const { rows } = await database.query(query, [debtsIds]);
    return rows;
  }


  /**
   * Obtiene las categorias del usuario autenticado
   * @param userId
   */
  async getDebtByUser(userId: string): Promise<GetDebt[]> {

    const query = `SELECT
                       d.id AS "debtId", d.creditor_id AS "creditorId", d.debtor_id AS "debtorId", d.amount, d.description, d.created_at AS "createdAt",
                       d.updated_at AS "updatedAt",
                       c.name AS "creditorName",
                       de.name AS "debtorName",
                       c.email AS "creditorEmail",
                       de.email AS "debtorEmail",
                       s.name AS status,
                       COALESCE(SUM(p.amount), 0) AS "totalPaid",
                       (d.amount - COALESCE(SUM(p.amount), 0)) AS remaining
                   FROM debts d
                            JOIN users c  ON c.id  = d.creditor_id
                            JOIN users de ON de.id = d.debtor_id
                            JOIN status s ON s.id = d.status_id
                            LEFT JOIN payments p ON p.debt_id = d.id
                   WHERE d.debtor_id = $1 AND d.deleted_at IS NULL
                   GROUP BY d.id, c.email, c.name, de.name, de.email, s.name;`;

    const { rows } = await database.query(query, [userId]);
    return rows;
  }

  /**
   * Crear deuda
   * @param data<CreateDebt>
   * @param userId
   */
  async createDebt(data: CreateDebt,userId: string): Promise<void> {

    const query = `INSERT INTO debts (creditor_id, debtor_id, amount, currency, description, due_date, status_id)
                   SELECT $1, $2, $3, COALESCE($4, 'COP'), $5, $6, s.id
                   FROM status s
                   WHERE s.name = $7
                       RETURNING *;`;
    const parameters = [
      userId,
      data.debtorId,
      data.amount,
      data.currency,
      data.description,
      data.dueDate,
      STATUS.PENDING
    ];

    await database.query(query, parameters);
  }

  /**
   * Actualizar una deuda.
   * @param data<UpdateDebt>
   * @param debtId
   */
  async updateDebt(data: UpdateDebt, debtId:string): Promise<any> {

    const query = `UPDATE debts
                   SET amount = $2,
                       currency = COALESCE($3, currency),
                       description = $4,
                       due_date = $5
                   WHERE id = $1
                     AND deleted_at IS NULL
                     AND status_id <> (SELECT id FROM status WHERE name = $6)
                       RETURNING *;`;
    const parameters = [
      debtId,
      data.amount,
      data.currency,
      data.description,
      data.dueDate,
      STATUS.PAID
    ];

    const { rows } = await database.query(query, parameters);
    return rows[0] ?? null; // null si no actualizó (ej: estaba PAID)
  }

  /**
   * Eliminar una deuda.
   * @param debtId
   */
  async deleteDebt(debtId:string): Promise<void> {

    const query = `UPDATE debts
                   SET deleted_at = now(), status_id = (SELECT id FROM status WHERE name = $2)
                   WHERE id = $1 AND deleted_at IS NULL
                       RETURNING id, deleted_at;`;
    const parameters = [
      debtId,
      STATUS.DELETED
    ];

    await database.query(query, parameters);
  }

}

export default new DebtsRepository();