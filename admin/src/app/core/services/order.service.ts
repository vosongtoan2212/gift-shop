import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { API_BASE_URL } from 'src/app/core/configs/constants';
import { IOrder } from 'src/app/core/configs/interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandler,
  ) {}

  public getOrders() {
    return this.http.get<IOrder[]>(`${API_BASE_URL}/admin/order`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleError(error);
        return of([]); // trả về mảng rỗng nếu lỗi
      }),
    );
  }
}
