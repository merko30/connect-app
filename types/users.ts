export interface User {
  email?: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  role: {
    name: string;
  };
}
