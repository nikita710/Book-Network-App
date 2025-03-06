import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-menu',
  imports: [RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
  standalone: true,
})
export class MenuComponent implements OnInit {
  ngOnInit(): void {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      if (window.location.href.endsWith(link.getAttribute('href') || '')) {
        link.classList.add('active');
      }
      link.addEventListener('click', (e) => {
        navLinks.forEach((link) => link.classList.remove('active'));
        link.classList.add('active');
      });
    });
  }
  logout() {
    throw new Error('Method not implemented.');
  }
}
