import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // Xử lý login
  async onSubmit() {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      // Gọi AuthService để xử lý đăng nhập
      this.authService.loginWithEmail(email, password).subscribe({
        next: (res: any) => {
          if (res.user.role !== 'admin') {
            this.errorMessage = 'Bạn không có quyền truy cập';
            return;
          }
          const token = res.accessToken;
          if (token) {
            this.authService.saveToken(token);
            this.router.navigate(['/category']);
          }
        },
        error: (err: any) => {
          if (err.status === 401) {
            this.errorMessage = 'Địa chỉ email hoặc mật khẩu không đúng';
          }
          console.error('Login failed:', err.error.message);
        },
      });
    }
  }
}
