import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable } from '@angular/core';
import { catchError, of } from 'rxjs';
import { API_BASE_URL } from 'src/app/core/configs/constants';
import { ICategory } from 'src/app/core/configs/interface';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandler,
  ) {}

  public getCategories() {
    return this.http.get<ICategory[]>(`${API_BASE_URL}/admin/category`).pipe(
      catchError((error: HttpErrorResponse) => {
        this.errorHandler.handleError(error);
        return of([]); // trả về mảng rỗng nếu lỗi
      }),
    );
  }
}
