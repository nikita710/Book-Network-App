import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { BookRequest } from '../../../../services/models';
import { BookService } from '../../../../services/services';

@Component({
  selector: 'app-manage-book',
  imports: [FormsModule, RouterLink],
  templateUrl: './manage-book.component.html',
  styleUrl: './manage-book.component.scss',
  standalone: true,
})
export class ManageBookComponent implements OnInit {
  private bookService = inject(BookService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  errorMsg: string[] = [];
  selectedPicture = '';
  selectedBookCover: File | null = null;
  bookRequest: BookRequest = {
    title: '',
    authorName: '',
    isbn: '',
    synopsis: '',
  };

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params) => {
      if (params['bookId']) {
        this.bookService
          .findByBookId({
            'book-id': params['bookId'],
          })
          .subscribe({
            next: (book) => {
              this.bookRequest = {
                id: book.id,
                title: book.title as string,
                authorName: book.authorName as string,
                isbn: book.isbn as string,
                synopsis: book.synopsis as string,
                sharable: book.sharable as boolean,
              };
              if (book.cover) {
                this.selectedPicture = 'data:image/jpg;base64,' + book.cover;
              }
            },
          });
      }
    });
  }

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
