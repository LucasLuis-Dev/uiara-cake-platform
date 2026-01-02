export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  message?: string;
}

export interface User {
  userId: string;
  email: string;
}
