import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { LayoutComponent } from '@components/layout/layout.component';
import { IOrder } from 'src/app/core/configs/interface';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { EditOrderDialogComponent } from 'src/app/pages/authorized/order/edit-order-dialog/edit-order-dialog.component';
import { OrderService } from '@services/order.service';
import { ViewOrderDialogComponent } from 'src/app/pages/authorized/order/view-order-dialog/view-order-dialog.component';

@Component({
  selector: 'app-order',
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
  templateUrl: './order.component.html',
  styles: ``,
})
export class OrderComponent implements OnInit {
  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private orderService: OrderService,
  ) {}

  displayedColumns: string[] = [
    'id',
    'name',
    'phone',
    'address',
    'note',
    'status',
    'price',
    'action',
  ];
  expandedOrder: any = null;
  dataSource = new MatTableDataSource<IOrder>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  async ngOnInit(): Promise<void> {
    this.orderService.getOrders().subscribe({
      next: res => (this.dataSource.data = res),
      error: err => console.error('Lỗi khi lấy đơn hàng:', err),
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

  getStatus(status: string): { text: string; style: string } {
    switch (status) {
      case 'pending':
        return { text: 'Đang chờ xử lý', style: 'bg-yellow-100 text-yellow-800' };
      case 'processing':
        return { text: 'Đang xử lý', style: 'bg-yellow-300 text-yellow-800' };
      case 'shipping':
        return { text: 'Đang vận chuyển', style: 'bg-blue-100 text-blue-800' };
      case 'completed':
        return { text: 'Hoàn thành', style: 'bg-green-100 text-green-800' };
      case 'cancelled':
        return { text: 'Đã hủy', style: 'bg-red-100 text-red-800' };
      default:
        return { text: 'Không xác định', style: 'bg-gray-100 text-gray-800' };
    }
  }

  openEditDialog(order?: IOrder): void {
    const dialogRef = this.dialog.open(EditOrderDialogComponent, {
      width: '400px',
      data: order || null,
    });

    dialogRef.afterClosed().subscribe((result: IOrder | undefined) => {
      if (result) {
        // chỉnh sửa: cập nhật lại dòng trong bảng
        this.snackBar.open('Đã cập nhật thành công!', 'Đóng', { duration: 3000 });
        const index = this.dataSource.data.findIndex(c => c.id === result.id);
        if (index > -1) {
          const updatedData = [...this.dataSource.data];
          updatedData[index] = result;
          this.dataSource.data = updatedData;
        }
      }
    });
  }
  openViewDialog(order?: IOrder): void {
    const dialogRef = this.dialog.open(ViewOrderDialogComponent, {
      width: '800px',
      data: order || null,
    });
  }
}
