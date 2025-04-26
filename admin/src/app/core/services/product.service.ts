import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { API_BASE_URL } from 'src/app/core/configs/constants';
import { IProduct } from 'src/app/core/configs/interface';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandler,
  ) {}

  public getProducts() {
    return this.http.get<IProduct[]>(`${API_BASE_URL}/admin/product`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleError(error);
        return of([]); // trả về mảng rỗng nếu lỗi
      }),
    );
  }
}
