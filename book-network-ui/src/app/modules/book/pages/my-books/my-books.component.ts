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
  bookDemo: BookResponse = {
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

  bookResponse: PageResponseBookResponse = {};
  page = 0;
  size = 5;

  ngOnInit(): void {
    this.findAllBooks();
  }
  private findAllBooks() {
    this.bookService
      .findAllBooksByOwner({ page: this.page, size: this.size })
      .subscribe({
        next: (response) => {
          this.bookResponse = response;
        },
      });
  }

  onShareBook(book: BookResponse) {}
  onEditBook(book: BookResponse) {}
  onArchiveBook(book: BookResponse) {}

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
