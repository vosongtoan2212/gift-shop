import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { GlobalsService } from '@services/globals.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  title = 'note-webapp';

  constructor(
    private globalService: GlobalsService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    if (localStorage.getItem('theme') == 'dark') {
      this.globalService.isDarkMode = true;
    }
    if (this.globalService.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark');
    } else {
      this.renderer.addClass(this.document.body, 'light');
    }
  }
}
