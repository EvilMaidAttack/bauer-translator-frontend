import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navigation',
  imports: [],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss'
})
export class Navigation {
  auth = inject(AuthService)
  router = inject(Router);

  logout(){
    this.auth.logout();
    this.router.navigate(["/login"]);
  }

}
