import { Component, Inject, OnInit } from '@angular/core';
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
import { ICategory, IProduct } from 'src/app/core/configs/interface';
import { CategoryService } from '@services/category.service';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-edit-product-dialog',
  standalone: true,
  templateUrl: './edit-product-dialog.component.html',
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
export class EditProductDialogComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean;
  categories: ICategory[] = [];

  constructor(
    public dialogRef: MatDialogRef<EditProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: IProduct | null,
    private fb: FormBuilder,
    private http: HttpClient,
    private categoryService: CategoryService,
  ) {
    this.isEditMode = !!data;

    this.form = this.fb.group({
      id: [data?.id],
      name: [data?.name || '', Validators.required],
      description: [data?.description || '', Validators.required],
      price: [data?.price ?? '', Validators.required],
      stock: [data?.stock ?? '', Validators.required],
      imageUrl: [data?.imageUrl || '', Validators.required],
      categoryId: [data?.categoryId || '', Validators.required],
    });
  }

  ngOnInit(): void {
    this.categoryService.getCategories().subscribe({
      next: res => (this.categories = res),
      error: err => console.error('Lỗi khi lấy danh mục:', err),
    });
  }

  onSave(): void {
    if (this.form.invalid) return;

    const product = this.form.value;
    product.brandId = 1;

    const request = this.isEditMode
      ? this.http.patch(`${API_BASE_URL}/admin/product/${product.id}`, product)
      : this.http.post(`${API_BASE_URL}/admin/product/create`, product);

    request.subscribe({
      next: (res: any) => {
        this.dialogRef.close(res);
      },
      error: err => {
        console.error('Lỗi khi lưu danh mục:', err);
        alert(this.isEditMode ? 'Cập nhật thất bại!' : 'Thêm mới thất bại!');
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
