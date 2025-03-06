import { Component, input, OnInit, output, signal } from '@angular/core';
import { BookResponse } from '../../../../services/models';
import { RatingComponent } from '../rating/rating.component';

@Component({
  selector: 'app-book-card',
  imports: [RatingComponent],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.scss',
  standalone: true,
})
export class BookCardComponent implements OnInit {
  book = input<BookResponse>({});
  bookCover = signal('');
  manage = input<boolean>(false);

  archive = output<BookResponse>();
  share = output<BookResponse>();
  edit = output<BookResponse>();
  addToWaitingList = output<BookResponse>();
  borrow = output<BookResponse>();
  showDetails = output<BookResponse>();

  ngOnInit(): void {
    // if (this.book().cover) {
    //   this.bookCover.set('data:image/jpg;base64,' + this.book().cover);
    // } else {
    //   this.bookCover.set(
    //     'https://random-image-pepebigotes.vercel.app/api/random-image'
    //   );
    // }
  }

  onArchive() {
    this.archive.emit(this.book());
  }
  onShare() {
    this.share.emit(this.book());
  }
  onEdit() {
    this.edit.emit(this.book());
  }
  onAddToWaitingList() {
    this.addToWaitingList.emit(this.book());
  }
  onBorrow() {
    this.borrow.emit(this.book());
  }
  onShowDetails() {
    this.showDetails.emit(this.book());
  }
}
