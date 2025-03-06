import { Component, input } from '@angular/core';

@Component({
  selector: 'app-rating',
  imports: [],
  templateUrl: './rating.component.html',
  styleUrl: './rating.component.scss',
  standalone: true,
})
export class RatingComponent {
  rating = input(0);
  maxRating = 5;

  get fullStars() {
    return Math.floor(this.rating());
  }
  get halfStars() {
    return this.rating() % 1 !== 0;
  }
  get emptyStars() {
    return this.maxRating - Math.ceil(this.rating());
  }
}
