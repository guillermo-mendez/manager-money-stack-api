import * as yup from 'yup';
import {validateSchema} from "./ValidateSchema";

class DebtValidator {
  /**
   * Valida los datos crear deuda.
   * @param data - Datos a validar.
   */
  public createDebtValidation(data: any) {
    const schema = yup.object().shape({
      debtorId: yup
        .string()
        .required('El campo ID de quien debe es requerido'),
      amount: yup
        .number()
        .typeError('El campo monto debe ser un número')
        .required('El campo monto es requerido')
        .positive('El campo monto debe ser un número positivo'),
      currency: yup
        .string()
        .notRequired(),
      description: yup
        .string()
        .required('El campo descripción es requerido'),
      dueDate: yup
        .string()
        .required('El campo fecha de vencimiento es requerido'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos buscar deuda por usuario.
   * @param data - Datos a validar.
   */
  public getDebtByUserValidation(data: any) {
    const schema = yup.object().shape({
      userId: yup
        .string()
        .required('El campo userId debe es requerido'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos de actualizar deuda.
   * @param data - Datos a validar.
   */
  public updateDebtValidation(data: any) {
    const schema = yup.object().shape({
      debtId: yup
        .string()
        .required('El campo ID de deuda es requerido'),
      amount: yup
        .string()
        .required('Debe ingresar el amount de la deuda'),
      currency: yup
        .string()
        .required('Debe ingresar la divisa de la deuda'),
      description: yup
        .string(),
      dueDate: yup
        .string()
        .required('Debe ingresar la fecha de vencimiento de la deuda'),
    });
    validateSchema(schema, data);
  }

  /**
   * Valida los datos de eliminar deuda.
   * @param data - Datos a validar.
   */
  public eliminarDebtValidation(data: any) {
    const schema = yup.object().shape({
      debtId: yup
        .string()
        .required('El campo ID de deuda es requerido')
    });
    validateSchema(schema, data);
  }

}

export default new DebtValidator();
