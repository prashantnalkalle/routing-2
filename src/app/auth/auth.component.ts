import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService, CreateUserRequest, LoginRequest } from '../auth.service';
import { SnackbarService } from '../shared/service/snackbar.service';

type AuthMode = 'login' | 'register' | 'forgot';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  mode: AuthMode = 'login';
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  forgotForm!: FormGroup;
  submitted = false;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';
  showPassword = false;
  showConfirmPassword = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackbar: SnackbarService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [Validators.required, Validators.maxLength(128)]]
    });
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
      password: ['', [
        Validators.required,
        Validators.minLength(12),
        Validators.maxLength(128),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/)
      ]],
      confirmPassword: ['', Validators.required],
      role: ['buyer', Validators.required]
    }, { validators: this.passwordsMatch });
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]]
    });
  }

  get loginEmailControl(): AbstractControl { return this.loginForm.get('email') as AbstractControl; }
  get loginPasswordControl(): AbstractControl { return this.loginForm.get('password') as AbstractControl; }
  get registerEmailControl(): AbstractControl { return this.registerForm.get('email') as AbstractControl; }
  get registerPasswordControl(): AbstractControl { return this.registerForm.get('password') as AbstractControl; }
  get registerConfirmPasswordControl(): AbstractControl { return this.registerForm.get('confirmPassword') as AbstractControl; }
  get registerRoleControl(): AbstractControl { return this.registerForm.get('role') as AbstractControl; }
  get forgotEmailControl(): AbstractControl { return this.forgotForm.get('email') as AbstractControl; }

  private passwordsMatch(control: AbstractControl): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return confirmPassword && password !== confirmPassword ? { passwordsMismatch: true } : null;
  }

  setMode(mode: AuthMode): void {
    if (mode === 'forgot' && this.loginForm) {
      this.forgotForm.patchValue({ email: this.loginForm.value.email });
    }
    this.mode = mode;
    this.submitted = false;
    this.message = '';
  }

  submitLogin(): void {
    this.submitted = true;
    this.message = '';
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const body: LoginRequest = this.loginForm.getRawValue();
    this.loading = true;
    this.authService.login(body).pipe(finalize(() => this.loading = false)).subscribe({
      next: (response) => {
        this.authService.saveToken(response.accessToken);
        this.authService.saveuserRole(response.userRole);
        this.router.navigate(['/home']);
      },
      error: (response: HttpErrorResponse) => this.showApiError(response)
    });
  }

  submitRegister(): void {
    this.submitted = true;
    this.message = '';
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const { email, password, role } = this.registerForm.getRawValue();
    const body: CreateUserRequest = { email, password, role };
    this.loading = true;
    this.authService.createUser(body).pipe(finalize(() => this.loading = false)).subscribe({
      next: (response) => {
        this.setMode('login');
        this.messageType = 'success';
        this.message = `Account created for ${response.user.email}. You can now sign in.`;
        this.loginForm.patchValue({ email: response.user.email });
      },
      error: (response: HttpErrorResponse) => this.showApiError(response)
    });
  }

  submitForgot(): void {
    this.submitted = true;
    this.message = '';
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.authService.forgotPassword(this.forgotForm.getRawValue())
      .pipe(finalize(() => this.loading = false))
      .subscribe({
        next: () => {
          this.messageType = 'success';
          this.message = 'If an account exists for this email, password reset instructions have been sent.';
        },
        error: (response: HttpErrorResponse) => this.showApiError(response)
      });
  }

  private showApiError(response: HttpErrorResponse): void {
    const apiError = response.error?.error ?? response.error;
    const validationMessage = apiError?.details
      ?.map((detail: { field?: string; message?: string }) => detail.message)
      .filter((detail: string | undefined): detail is string => Boolean(detail))
      .join(' ');
    const apiMessage = validationMessage || apiError?.message;
    this.messageType = 'error';
    this.message = response.status
      ? `HTTP ${response.status}${apiError?.code ? ` (${apiError.code})` : ''}: ${apiMessage || response.statusText || 'Request failed.'}`
      : apiMessage || 'Cannot connect to the server. Check your connection and try again.';
    this.snackbar.openSnackbar(this.message);
  }
}
