import { LoginCredentials } from './../services/auth';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  loading = false;
  error = '';
  form: FormGroup;

  private redirectUrl = '/translate'; // default target after login

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const qp = this.route.snapshot.queryParamMap;
    const redirect = qp.get('redirect');
    if (redirect) this.redirectUrl = redirect;
    this.form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });
  }

  submit() {
    if (this.form.invalid || this.loading) return;
    this.loading = true;
    this.error = '';

    const credentials = this.form.value as LoginCredentials

    this.auth.login(
      credentials,
      () => this.performRouting(),
      () => console.log("Login failed! Please try again.") 
    )
  }

  performRouting() {
    this.router.navigateByUrl(this.redirectUrl);
  }

}
