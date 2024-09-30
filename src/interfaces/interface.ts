export interface AuthResponse {
  message: string;
  name: string;
  email:string;
  refreshToken: string;
  token: string;
  _id: string;
  service: string;
  image: string;
  mobile: string;
  isVerified: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  serviceImage:string;
}

export interface User {
  message: string;
  id: string;
  name: string;
  email: string;
  mobile: number;
  userImage: string;
}

export interface Expert {
  message: string;
  id: string;
  name: string;
  email: string;
  mobile: number;
  expertImage: string;
}


export interface AdminAuthResponse {
  message: string;
  name: string;
  token: string;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}

export interface UserCredentials {
  userId: string;
  role: string;
}