import { Component } from '@angular/core';
import {LoginRequest} from "../../services/models/login-request";
import { Router } from '@angular/router';
import {AuthenticationService} from "../../services/services/authentication.service";
import {TokenService} from "../../services/token.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  loginRequest: LoginRequest = {email: '', password: ''};
  errorMsg: Array<String> = [];

  constructor(
    private router: Router,
    private authService: AuthenticationService,
    private tokenService: TokenService,
  ) {
  }

  login() {
    this.errorMsg = [];
    this.authService.login({
      body: this.loginRequest
    }).subscribe({
      next: (res) => {
        this.tokenService.token = res.token as string;
        this.router.navigate(['books']);
      },
      error: (err) => {
        console.log(err);
        if (err.error.validationErrors) {
          this.errorMsg = err.error.validationErrors;
        } else {
          this.errorMsg.push(err.error.error);
        }
      }
    })
  }

  register() {
    this.router.navigate(['register'])
  }
}
