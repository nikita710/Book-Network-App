import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationRequest } from '../../services/models';
import { AuthenticationService } from '../../services/services';
import { TokenService } from '../../services/token/token.service';
@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  standalone: true,
  providers: [],
})
export class LoginComponent {
  authRequest: AuthenticationRequest = { email: '', password: '' };
  errorMsg: Array<string> = [];
  private authService = inject(AuthenticationService);
  private router = inject(Router);
  private tokenService = inject(TokenService);

  register() {
    this.router.navigate(['register']);
  }
  login() {
    this.errorMsg = [];
    this.authService.authenticate({ body: this.authRequest }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string;
        this.router.navigate(['books']);
      },
      error: (err) => {
        err.error.validationErrors
          ? (this.errorMsg = err.error.validationErrors)
          : this.errorMsg.push(err.error.businessErrorDescription);
      },
    });
  }
}
