import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { API_BASE_URL } from 'src/app/core/configs/constants';
import { IOrder } from 'src/app/core/configs/interface';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-order-dialog',
  standalone: true,
  templateUrl: './edit-order-dialog.component.html',
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
export class EditOrderDialogComponent {
  form: FormGroup;
  statusList = [
    { value: 'pending', text: 'Đang chờ xử lý' },
    { value: 'processing', text: 'Đang xử lý' },
    { value: 'shipping', text: 'Đang vận chuyển' },
    { value: 'completed', text: 'Hoàn thành' },
    { value: 'cancelled', text: 'Đã hủy' },
  ];

  constructor(
    public dialogRef: MatDialogRef<EditOrderDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IOrder | null,
    private fb: FormBuilder,
    private http: HttpClient,
  ) {
    this.form = this.fb.group({
      status: [data?.status || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.form.invalid) return;

    const order = this.form.value;

    const request = this.http.put(`${API_BASE_URL}/admin/order/${this.data?.id}/status`, order);

    request.subscribe({
      next: (res: any) => {
        this.dialogRef.close(res);
      },
      error: err => {
        console.error('Lỗi khi lưu danh mục:', err);
        alert('Cập nhật thất bại!');
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
