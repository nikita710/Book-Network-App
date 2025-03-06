import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookRequest } from '../../../../services/models';
import { BookService } from '../../../../services/services';

@Component({
  selector: 'app-manage-book',
  imports: [FormsModule, RouterLink],
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.scss',
  standalone: true,
})
export class ManageBookComponent {
  private bookService = inject(BookService);
  private router = inject(Router);

  errorMsg: string[] = [];
  selectedPicture = '';
  selectedBookCover: File | null = null;
  bookRequest: BookRequest = {
    title: '',
    authorName: '',
    isbn: '',
    synopsis: '',
  };

  onFileSelected(event: any) {
    this.selectedBookCover = event.target?.files[0];
    console.log(this.selectedBookCover);
    if (this.selectedBookCover) {
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedPicture = reader.result as string;
      };
      reader.readAsDataURL(this.selectedBookCover);
    }
  }

  saveBook() {
    this.bookService
      .createBook({
        body: this.bookRequest,
      })
      .subscribe({
        next: (bookId) => {
          this.bookService
            .uploadBookCoverPicture({
              'book-id': bookId,
              body: {
                file: this.selectedBookCover as Blob,
              },
            })
            .subscribe({
              next: () => {
                this.router.navigate(['/books/my-books']);
              },
            });
        },
        error: (err) => {
          if (err.error) {
            this.errorMsg = [err.error.error];
          } else {
            this.errorMsg = err.error.validationErrors;
          }
        },
      });
  }
}
