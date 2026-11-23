import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: string;
  userRole: string;
  user: AuthUser;
}

export interface CreateUserRequest {
  email: string;
  password: string;
  role: string;
}

export interface CreateUserResponse {
  user: AuthUser;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ForgotPasswordResponse {
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.Auth_url;

  constructor(private readonly http: HttpClient) {}

  login(body: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, body);
  }

  createUser(body: CreateUserRequest): Observable<CreateUserResponse> {
    return this.http.post<CreateUserResponse>(`${this.apiUrl}/users`, body);
  }

  forgotPassword(body: ForgotPasswordRequest): Observable<ForgotPasswordResponse> {
    return this.http.post<ForgotPasswordResponse>(`${this.apiUrl}/auth/forgot-password`, body);
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
  }

  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  gettoken(): string {
    return localStorage.getItem('token') as string
  }

  getuserRole(): string  {
    return localStorage.getItem('userRole') as string
  }

  saveuserRole(userRole: string): void {
    localStorage.setItem('userRole', userRole);
  }
}
