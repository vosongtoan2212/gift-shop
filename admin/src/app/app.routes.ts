import { Routes } from '@angular/router';
import { LoginComponent } from './pages/unauthorized/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NotAuthGuard } from './core/guards/notAuth.guard';
import { CategoryComponent } from 'src/app/pages/authorized/category/category.component';
import { ProductComponent } from 'src/app/pages/authorized/product/product.component';
import { OrderComponent } from 'src/app/pages/authorized/order/order.component';

export const routes: Routes = [
  { path: '', redirectTo: 'product', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  {
    path: 'product',
    component: ProductComponent,
    canActivate: [AuthGuard], // Bảo vệ route
  },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard], // Bảo vệ route
  },
  {
    path: 'order',
    component: OrderComponent,
    canActivate: [AuthGuard], // Bảo vệ route
  },
  { path: '**', redirectTo: 'product' },
];
