import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IOrder } from 'src/app/core/configs/interface';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-view-order-dialog',
  standalone: true,
  templateUrl: './view-order-dialog.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
  ],
})
export class ViewOrderDialogComponent {
  statusList = [
    { value: 'pending', text: 'Đang chờ xử lý' },
    { value: 'processing', text: 'Đang xử lý' },
    { value: 'shipping', text: 'Đang vận chuyển' },
    { value: 'completed', text: 'Hoàn thành' },
    { value: 'cancelled', text: 'Đã hủy' },
  ];

  constructor(
    public dialogRef: MatDialogRef<ViewOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IOrder | null,
  ) {}

  onCancel(): void {
    this.dialogRef.close();
  }
}
