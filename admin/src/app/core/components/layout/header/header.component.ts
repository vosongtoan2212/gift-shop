import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ThemeToggleComponent } from '@components/layout/header/theme-toggle/theme-toggle.component';
import { AuthService } from '@services/auth.service';
import { GlobalsService } from '@services/globals.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [ThemeToggleComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    public globalService: GlobalsService,
  ) {}

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleNavigation(): void {
    this.globalService.isOpenNav = !this.globalService.isOpenNav;
  }
}
