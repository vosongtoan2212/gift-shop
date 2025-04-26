import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GlobalsService {
  constructor() {}

  public isOpenNav: boolean = true;
  public isDarkMode: boolean = false;
}
