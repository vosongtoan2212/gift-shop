import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, MatIconModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  navigationItems = [
    {
      text: 'Sản phẩm',
      icon: 'storefront',
      to: '/product',
    },
    {
      text: 'Danh mục',
      icon: 'toc',
      to: '/category',
    },
    {
      text: 'Đơn hàng',
      icon: 'receipt_long',
      to: '/order',
    },
  ];
}
