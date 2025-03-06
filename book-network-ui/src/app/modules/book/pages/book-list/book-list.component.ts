import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  BookResponse,
  PageResponseBookResponse,
} from '../../../../services/models';
import { BookService } from '../../../../services/services';
import { BookCardComponent } from '../../components/book-card/book-card.component';

const fakeBook: BookResponse = {
  archived: false,
  authorName: 'Nikita',
  cover: 'https://random-image-pepebigotes.vercel.app/api/random-image',
  id: 101,
  isbn: 'ADFT852',
  ownerName: 'Shital',
  rating: 4.2,
  sharable: false,
  synopsis: 'good one',
  title: 'Positive Attribute',
};

@Component({
  selector: 'app-book-list',
  imports: [BookCardComponent],
  templateUrl: './book-list.component.html',
  styleUrl: './book-list.component.scss',
  standalone: true,
})
export class BookListComponent implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);
  bookDemo = fakeBook;

  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 5;
  message = '';
  level = '';

  ngOnInit(): void {
    this.findAllBooks();
  }
  private findAllBooks() {
    this.bookService
      .findAllBooks({ page: this.page, size: this.size })
      .subscribe({
        next: (response) => {
          this.bookResponse = response;
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

  onBorrowBook(book: BookResponse) {
    this.bookService
      .borrowBook({
        'book-id': book.id as number,
      })
      .subscribe({
        next: () => {
          this.message = 'Book borrowed successfully';
          this.level = 'success';
          this.findAllBooks();
        },
        error: (err) => {
          this.message = err.error.error;
          this.level = 'error';
        },
      });
  }
}
