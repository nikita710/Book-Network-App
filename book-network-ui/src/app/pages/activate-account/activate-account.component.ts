import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CodeInputModule } from 'angular-code-input';
import { AuthenticationService } from '../../services/services';

@Component({
  selector: 'app-activate-account',
  imports: [CodeInputModule],
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss',
})
export class ActivateAccountComponent {
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  message = '';
  isOkay = true;
  submitted = false;

  onCodeCompleted(token: string) {
    this.confirmAccount(token);
  }
  confirmAccount(token: string) {
    this.authService.confirm({ token }).subscribe({
      next: () => {
        this.message =
          ' Your account has been successfully activated.\nYou can now log in. ';
        this.submitted = true;
        this.isOkay = true;
      },
      error: (error) => {
        this.message = 'Token has been expired or invalid.';
        this.submitted = true;
        this.isOkay = false;
      },
    });
  }

  redirectToLogin() {
    this.router.navigate(['login']);
  }
}
