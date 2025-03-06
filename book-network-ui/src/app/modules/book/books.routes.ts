import { Routes } from '@angular/router';
import { BookListComponent } from './pages/book-list/book-list.component';
import { MainComponent } from './pages/main/main.component';
import { ManageBookComponent } from './pages/manage-book/manage-book.component';
import { MyBooksComponent } from './pages/my-books/my-books.component';

export const booksRoutes: Routes = [
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        component: BookListComponent,
      },
      {
        path: 'my-books',
        component: MyBooksComponent,
      },
      {
        path: 'manage',
        component: ManageBookComponent,
      },
      {
        path: 'manage/:bookId',
        component: ManageBookComponent,
      },
    ],
  },
];
