import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  BookResponse,
  PageResponseBookResponse,
} from '../../../../services/models';
import { BookService } from '../../../../services/services';
import { BookCardComponent } from '../../components/book-card/book-card.component';

@Component({
  selector: 'app-my-books',
  imports: [BookCardComponent, RouterLink],
  templateUrl: './my-books.component.html',
  styleUrl: './my-books.component.scss',
  standalone: true,
})
export class MyBooksComponent implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);
  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 5;
  pages: number[] = [];

  ngOnInit(): void {
    this.findAllBooks();
  }
  private findAllBooks() {
    this.bookService
      .findAllBooksByOwner({ page: this.page, size: this.size })
      .subscribe({
        next: (response) => {
          this.bookResponse = response;
          this.pages = Array(this.bookResponse.totalPages)
            .fill(0)
            .map((x, i) => i);
        },
      });
  }

  onShareBook(book: BookResponse) {
    this.bookService
      .updateShareableStatus({
        'book-id': book.id as number,
      })
      .subscribe({
        next: () => {
          book.sharable = !book.sharable;
        },
      });
  }
  onEditBook(book: BookResponse) {
    this.router.navigate([`/books/manage/${book.id}`]);
  }
  onArchiveBook(book: BookResponse) {
    this.bookService
      .updateArchivedStatus({ 'book-id': book.id as number })
      .subscribe({
        next: () => {
          book.archived = !book.archived;
        },
      });
  }

  goToFirstPage() {
    this.page = 0;
    this.findAllBooks();
  }
  goToPreviousPage() {
    this.page--;
    this.findAllBooks();
  }
  gotToPage(index: number) {
    this.page = index;
    this.findAllBooks();
  }
  goToLastPage() {
    this.page = (this.bookResponse.totalPages as number) - 1;
    this.findAllBooks();
  }
  goToNextPage() {
    this.page++;
    this.findAllBooks();
  }
  get isLastPage() {
    return this.page === (this.bookResponse.totalPages as number) - 1;
  }
}
