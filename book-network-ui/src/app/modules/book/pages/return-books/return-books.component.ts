import { Component, inject, OnInit } from '@angular/core';
import {
  BorrowedBookResponse,
  PageResponseBorrowedBookResponse,
} from '../../../../services/models';
import { BookService } from '../../../../services/services';

@Component({
  selector: 'app-return-books',
  imports: [],
  templateUrl: './return-books.component.html',
  styleUrl: './return-books.component.scss',
})
export class ReturnBooksComponent implements OnInit {
  message = '';
  level = '';

  page = 0;
  size = 5;
  pages: number[] = [];
  returnedBooks: PageResponseBorrowedBookResponse = {};
  private bookService = inject(BookService);

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }
  findAllBorrowedBooks() {
    this.bookService
      .findAllBorrowedBooks({
        page: this.page,
        size: this.size,
      })
      .subscribe({
        next: (response) => {
          this.returnedBooks = response;
          this.pages = Array(this.returnedBooks.totalPages)
            .fill(0)
            .map((_, i) => i);
        },
        error: (error) => {
          console.error(error);
        },
      });
  }

  approveBookReturn(book: BorrowedBookResponse) {
    if (!book.returned) {
      this.message = 'Book is not returned';
      this.level = 'error';
      return;
    }
    this.bookService
      .approveReturnBorrowedBook({
        'book-id': book.id as number,
      })
      .subscribe({
        next: () => {
          this.message = 'Book returned successfully';
          this.level = 'success';
          this.findAllBorrowedBooks();
        },
        error: (err) => {
          this.message = err.error.error;
          this.level = 'error';
        },
      });
  }
  goToFirstPage() {
    this.page = 0;
    this.findAllBorrowedBooks();
  }
  goToPreviousPage() {
    this.page--;
    this.findAllBorrowedBooks();
  }
  gotToPage(index: number) {
    this.page = index;
    this.findAllBorrowedBooks();
  }
  goToLastPage() {
    this.page = (this.returnedBooks.totalPages as number) - 1;
    this.findAllBorrowedBooks();
  }
  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();
  }
  get isLastPage() {
    return this.page === (this.returnedBooks.totalPages as number) - 1;
  }
}
