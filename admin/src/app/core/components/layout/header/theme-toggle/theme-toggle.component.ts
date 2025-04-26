import { Component, Renderer2, Inject, OnInit } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { GlobalsService } from '@services/globals.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
})
export class ThemeToggleComponent {

  constructor(
    protected globalService: GlobalsService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  toggleTheme(): void {
    this.globalService.isDarkMode = !this.globalService.isDarkMode;
    if (this.globalService.isDarkMode) {
      this.renderer.removeClass(this.document.body, 'light');
      this.renderer.addClass(this.document.body, 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      this.renderer.removeClass(this.document.body, 'dark');
      this.renderer.addClass(this.document.body, 'light');
      localStorage.setItem('theme', 'light');
    }
  }
}
