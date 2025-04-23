import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NotAuthGuard implements CanActivate {
  private authService = inject(AuthService);
  private router = inject(Router);

  async canActivate(): Promise<boolean> {
    const isLoggedIn = await this.authService.isLoggedIn();
    if (!isLoggedIn) {
      return true; // Người dùng chưa đăng nhập
    } else {
      this.router.navigate(['/home']); // Chuyển hướng về trang home nếu đã đăng nhập
      return false;
    }
  }
}
