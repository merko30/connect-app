export interface Otp {
  code: string;
  expiresAt: string;
  phoneNumber?: string;
  email?: string;
}
