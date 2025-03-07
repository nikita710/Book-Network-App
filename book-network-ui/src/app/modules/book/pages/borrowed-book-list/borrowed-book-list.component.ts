import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  BorrowedBookResponse,
  FeedbackRequest,
  PageResponseBorrowedBookResponse,
} from '../../../../services/models';
import { BookService, FeedbackService } from '../../../../services/services';
import { RatingComponent } from '../../components/rating/rating.component';

@Component({
  selector: 'app-borrowed-book-list',
  imports: [FormsModule, RatingComponent, RouterLink],
  templateUrl: './borrowed-book-list.component.html',
  styleUrl: './borrowed-book-list.component.scss',
  standalone: true,
})
export class BorrowedBookListComponent implements OnInit {
  borrowedBooks: PageResponseBorrowedBookResponse = {};
  selectedBook: BorrowedBookResponse | undefined = undefined;
  feedbackRequest: FeedbackRequest = {
    bookId: 0,
    comment: '',
  };

  page = 0;
  size = 5;
  pages: number[] = [];

  private bookService = inject(BookService);
  private feedbackService = inject(FeedbackService);

  ngOnInit(): void {
    this.findAllBorrowedBooks();
  }
  findAllBorrowedBooks() {
    this.bookService
      .findAllBorrowedBooks({ page: this.page, size: this.size })
      .subscribe({
        next: (response) => {
          this.borrowedBooks = response;
          this.pages = Array(this.borrowedBooks.totalPages)
            .fill(0)
            .map((x, i) => i);
        },
      });
  }
  returnBorrowedBook(book: BorrowedBookResponse) {
    this.selectedBook = book;
    this.feedbackRequest.bookId = book.id as number;
  }

  returnBook(withFeedback: boolean) {
    this.bookService
      .returnBorrowedBook({
        'book-id': this.selectedBook?.id as number,
      })
      .subscribe({
        next: () => {
          if (withFeedback) {
            this.giveFeedback();
          }
          this.selectedBook = undefined;
          this.findAllBorrowedBooks();
        },
      });
  }
  giveFeedback() {
    this.feedbackService
      .saveFeedback({
        body: this.feedbackRequest,
      })
      .subscribe({
        next: () => {},
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
    this.page = (this.borrowedBooks.totalPages as number) - 1;
    this.findAllBorrowedBooks();
  }
  goToNextPage() {
    this.page++;
    this.findAllBorrowedBooks();
  }
  get isLastPage() {
    return this.page === (this.borrowedBooks.totalPages as number) - 1;
  }
}
