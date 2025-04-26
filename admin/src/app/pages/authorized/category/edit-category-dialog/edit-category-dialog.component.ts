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
import { ICategory } from 'src/app/core/configs/interface';

@Component({
  selector: 'app-edit-category-dialog',
  standalone: true,
  templateUrl: './edit-category-dialog.component.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
  ],
})
export class EditCategoryDialogComponent {
  form: FormGroup;
  isEditMode: boolean;

  constructor(
    public dialogRef: MatDialogRef<EditCategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ICategory | null,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.isEditMode = !!data;

    this.form = this.fb.group({
      id: [data?.id],
      name: [data?.name || '', Validators.required],
    });
  }

  onSave(): void {
    if (this.form.invalid) return;

    const category = this.form.value;

    const request = this.isEditMode
      ? this.http.patch(`${API_BASE_URL}/admin/category/${category.id}`, category)
      : this.http.post(`${API_BASE_URL}/admin/category`, category);

    request.subscribe({
      next: (res: any) => {
        this.dialogRef.close(res);
      },
      error: (err) => {
        console.error('Lỗi khi lưu danh mục:', err);
        alert(this.isEditMode ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!');
      }
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
