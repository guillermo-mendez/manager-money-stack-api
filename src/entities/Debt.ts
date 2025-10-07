export interface CreateDebt {
  userId?: string;
  debtorId: string;
  amount: number;
  currency: string;
  description: string;
  dueDate: string;
}

export interface GetDebt  {
  debtId: string,
  creditorId: string,
  debtorId: string,
  amount: string,
  description: string,
  createdAt: string,
  updatedAt: string,
  creditorName: string,
  debtorName: string,
  creditorEmail: string,
  debtorEmail: string,
  status: string,
  totalPaid: string,
  remaining: string
}

export interface GetPayment  {
  paymentId: string,
  debtId: string,
  payerId: string,
  amount: string,
  note: string,
  createdAt: string,
  updatedAt: string,
  userPaymentName: string,
  userPaymentEmail: string
}

export interface UpdateDebt {
  amount: string;
  currency: string;
  description: string;
  dueDate: string;
}
