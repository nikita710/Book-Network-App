import { Routes } from '@angular/router';
import { ActivateAccountComponent } from './pages/activate-account/activate-account.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { authGuard } from './services/guard/auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'activate-account',
    component: ActivateAccountComponent,
  },
  {
    path: 'books',
    loadChildren: () =>
      import('./modules/book/books.routes').then((m) => m.booksRoutes),
    canActivate: [authGuard],
  },
];
