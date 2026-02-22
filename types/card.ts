export interface VerificationResponse {
  status: string;
  msg: string;
  data?: {
    national_id?: string;
    forenames?: string;
    surname?: string;
    region?: string;
    district?: string;
    date_of_birth?: string;
    gender?: string;
    phone?: string;
  };
}
