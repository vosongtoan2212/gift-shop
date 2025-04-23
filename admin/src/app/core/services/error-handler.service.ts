import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ErrorHandlerService {
  constructor() {}
  public handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      console.error('HTTP Error Status:', error.status);
      console.error('Error Message:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
