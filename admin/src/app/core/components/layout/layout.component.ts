import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { HeaderComponent } from '@components/layout/header/header.component';
import { NavigationComponent } from '@components/layout/navigation/navigation.component';
import { GlobalsService } from '@services/globals.service';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, NavigationComponent, HeaderComponent],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  constructor(public globalService: GlobalsService) {}

  @Input() content?: string;
}
