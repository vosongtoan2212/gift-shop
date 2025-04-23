import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navigation.component.html',
})
export class NavigationComponent {
  navigationItems = [
    {
      text: 'Danh mục',
      icon: 'fa-solid fa-list',
      to: '/category',
    },
  ];
}
