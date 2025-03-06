import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterRequest } from '../../services/models';
import { AuthenticationService } from '../../services/services';

@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  standalone: true,
})
export class RegisterComponent {
  registerRequest: RegisterRequest = {
    email: '',
    firstName: '',
    lastName: '',
    password: '',
  };
  errorMsg: Array<string> = [];
  private router = inject(Router);
  private authService = inject(AuthenticationService);

  register() {
    this.errorMsg = [];
    this.authService.register({ body: this.registerRequest }).subscribe({
      next: () => {
        this.router.navigate(['activate-account']);
      },
      error: (err) => {
        this.errorMsg = err.error.validationErrors;
      },
    });
  }

  login() {
    this.router.navigate(['login']);
  }
}
