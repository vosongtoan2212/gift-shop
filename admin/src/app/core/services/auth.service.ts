import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_BASE_URL } from '../configs/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  // Kiểm tra người dùng có đăng nhập hay không
  async isLoggedIn(): Promise<boolean> {
    try {
      const token = this.getToken();
      if (!token) {
        return false;
      }
      const response: any = await this.http
        .post(`${API_BASE_URL}/auth/check`, { token })
        .toPromise();
      return response && response.email ? true : false;
    } catch (error) {
      console.error('Error checking token validity', error);
      return false;
    }
  }

  // Hàm lưu token vào localStorage
  saveToken(token: string): void {
    localStorage.setItem('token', token);
  }

  // Lấy token
  getToken(): string | null {
    return localStorage.getItem('token');
  }
  // Đăng nhập bằng email và mật khẩu
  loginWithEmail(email: string, password: string) {
    return this.http.post(`${API_BASE_URL}/auth/login`, { email, password });
  }
  
  // Xóa token khi đăng xuất
  logout(): void {
    localStorage.removeItem('token');
  }
}
