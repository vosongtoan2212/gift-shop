import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (isLoggedIn) {
      return true; // Người dùng đã đăng nhập
    } else {
      this.router.navigate(['/login']); // Chuyển hướng về trang login nếu chưa đăng nhập
      return false;
    }
  }
}
