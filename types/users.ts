export interface User {
  email?: string;
  phoneNumber?: string;
  firstName: string;
  lastName: string;
  role: {
    name: string;
  };
}

export enum Role {
  ClubStaff = "Club-staff",
  Player = "Player",
}

export interface LoginValues {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  jwt: string;
}
