export interface AuthResponse {
  message: string;
  name: string;
  refreshToken: string;
  token: string;
  _id: string;
  image: string;
}

export interface AdminAuthResponse {
  message: string;
  name: string;
  token: string;
}

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}
