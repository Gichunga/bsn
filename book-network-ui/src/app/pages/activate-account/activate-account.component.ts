import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AuthenticationService} from "../../services/services/authentication.service";

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrl: './activate-account.component.scss'
})
export class ActivateAccountComponent {

  message = '';
  isOkay  = true;
  submitted = false;

  constructor(
    private router: Router,
    private authService: AuthenticationService
  ) {}

  private confirmAccount(token: string) {
    this.authService.activateAccount({
      token
    }).subscribe({
      next: () => {
        this.message = 'Your account has been successfully activated.\n You can now proceed to Login page';
        this.submitted = true;
        this.isOkay = true;
      },
      error: () => {
        this.message = 'Token has expired or is Invalid';
        this.submitted = true;
        this.isOkay = false;
      }
    })
  }

  onCodeCompleted(token: string) {
    this.confirmAccount(token)
  }

  redirectToLogin() {
    this.router.navigate(["login"]);
  }

}
