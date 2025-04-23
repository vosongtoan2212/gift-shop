import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LayoutComponent } from '@components/layout/layout.component';
import { API_BASE_URL } from 'src/app/core/configs/constants';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditProductDialogComponent } from 'src/app/pages/authorized/product/edit-product-dialog/edit-product-dialog.component';
import { IProduct } from 'src/app/core/configs/interface';
import { ProductService } from '@services/product.service';

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
  templateUrl: './product.component.html',
  styles: ``,
})
export class ProductComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private productService: ProductService,
  ) {}

  displayedColumns: string[] = [
    'id',
    'name',
    'price',
    'description',
    'category',
    'createdAt',
    'imageUrl',
    'stock',
    'action',
  ];
  dataSource = new MatTableDataSource<IProduct>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    this.productService.getProducts().subscribe({
      next: (res) => this.dataSource.data = res,
      error: (err) => console.error('Lỗi khi lấy sản phẩm:', err)
    });
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

  onDeleteProduct(id: number): void {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này không?')) return;

    this.http.delete(`${API_BASE_URL}/admin/product/${id}`).subscribe({
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

  openEditDialog(product?: IProduct): void {
    const dialogRef = this.dialog.open(EditProductDialogComponent, {
      width: '400px',
      data: product || null,
    });

    dialogRef.afterClosed().subscribe((result: IProduct | undefined) => {
      if (result) {
        if (product) {
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
}
