import { Routes } from '@angular/router';
import { authGuard } from '../../services/guard/auth.guard';
import { BookListComponent } from './pages/book-list/book-list.component';
import { BorrowedBookListComponent } from './pages/borrowed-book-list/borrowed-book-list.component';
import { MainComponent } from './pages/main/main.component';
import { ManageBookComponent } from './pages/manage-book/manage-book.component';
import { MyBooksComponent } from './pages/my-books/my-books.component';
import { ReturnBooksComponent } from './pages/return-books/return-books.component';

export const booksRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: BookListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'my-books',
        component: MyBooksComponent,
        canActivate: [authGuard],
      },
      {
        path: 'manage',
        component: ManageBookComponent,
        canActivate: [authGuard],
      },
      {
        path: 'manage/:bookId',
        component: ManageBookComponent,
        canActivate: [authGuard],
      },
      {
        path: 'my-borrowed-books',
        component: BorrowedBookListComponent,
        canActivate: [authGuard],
      },
      {
        path: 'my-returned-books',
        component: ReturnBooksComponent,
        canActivate: [authGuard],
      },
    ],
  },
];
