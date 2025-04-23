import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LayoutComponent } from '@components/layout/layout.component';
import { catchError, EMPTY } from 'rxjs';
import { API_BASE_URL } from 'src/app/core/configs/constants';
import { ICategory } from 'src/app/core/configs/interface';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditCategoryDialogComponent } from 'src/app/pages/authorized/category/edit-category-dialog/edit-category-dialog.component';

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [
    LayoutComponent,
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './category.component.html',
  styles: ``,
})
export class CategoryComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource = new MatTableDataSource<ICategory>();
  selectedCategory: ICategory | undefined = undefined;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    await this.getCategories();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  async getCategories(): Promise<void> {
    try {
      const response = await this.http
        .get<ICategory[]>(`${API_BASE_URL}/admin/category`)
        .pipe(
          catchError((error: HttpErrorResponse) => {
            this.handleError(error);
            return EMPTY;
          }),
        )
        .toPromise();
      console.log(response);
      if (response) {
        this.dataSource.data = response;
      }
    } catch (error) {
      this.handleError(error);
    }
  }

  onDeleteCategory(id: number): void {
    if (!confirm('Bạn có chắc muốn xóa danh mục này không?')) return;

    this.http.delete(`${API_BASE_URL}/admin/category/${id}`).subscribe({
      next: () => {
        this.snackBar.open('Đã xóa thành công!', 'Đóng', { duration: 3000 });
        // Cập nhật lại danh sách
        this.dataSource.data = this.dataSource.data.filter(c => c.id !== id);
      },
      error: error => {
        console.error('Lỗi xóa:', error);
        this.snackBar.open('Xóa thất bại!', 'Đóng', { duration: 3000 });
      },
    });
  }

  openEditDialog(category?: ICategory): void {
    const dialogRef = this.dialog.open(EditCategoryDialogComponent, {
      width: '400px',
      data: category || null,
    });

    dialogRef.afterClosed().subscribe((result: ICategory | undefined) => {
      if (result) {
        if (category) {
          // chỉnh sửa: cập nhật lại dòng trong bảng
          this.snackBar.open('Đã sửa thành công!', 'Đóng', { duration: 3000 });
          const index = this.dataSource.data.findIndex(c => c.id === result.id);
          if (index > -1) {
            const updatedData = [...this.dataSource.data];
            updatedData[index] = result;
            this.dataSource.data = updatedData;
          }
        } else {
          // thêm mới: thêm vào bảng
          this.snackBar.open('Đã thêm thành công!', 'Đóng', { duration: 3000 });
          this.dataSource.data = [...this.dataSource.data, result];
        }
      }
    });
  }

  private handleError(error: any): void {
    if (error instanceof HttpErrorResponse) {
      console.error('HTTP Error Status:', error.status);
      console.error('Error Message:', error.message);
    } else {
      console.error('Unexpected error:', error);
    }
  }
}
