import { Routes } from '@angular/router';
import { LoginComponent } from './pages/unauthorized/login/login.component';
import { AuthGuard } from './core/guards/auth.guard';
import { NotAuthGuard } from './core/guards/notAuth.guard';
import { CategoryComponent } from 'src/app/pages/authorized/category/category.component';

export const routes: Routes = [
  { path: '', redirectTo: 'category', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [NotAuthGuard] },
  {
    path: 'category',
    component: CategoryComponent,
    canActivate: [AuthGuard], // Bảo vệ route
  },
  { path: '**', redirectTo: 'category' },
];
