
export interface User {
  id: string;
  name: string;
  email: string;
  credits: number;
  role: 'user' | 'admin';
  isBlocked: boolean;
}

export interface CreditPackage {
  id: string;
  name: string;
  credits: number;
  price: number;
}

export interface PaymentDetails {
  methodName: string;
  accountNumber: string;
  qrCodeUrl: string;
}

export interface Settings {
  paymentDetails: PaymentDetails;
  creditPackages: CreditPackage[];
}

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface PaymentRequest {
  id: string;
  userId: string;
  userEmail: string;
  packageId: string;
  packageName: string;
  transactionId: string;
  status: PaymentStatus;
  createdAt: Date;
}

export interface GeneratedImage {
    id: string;
    url: string;
    prompt: string;
}
