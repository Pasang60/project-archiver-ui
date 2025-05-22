import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../service/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '../../common/toast.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']  // ✅ Fixed typo: should be `styleUrls` not `styleUrl`
})
export class LoginComponent implements OnInit {

  @ViewChild('loginForm') loginForm!: ElementRef;

  loginDetail!: FormGroup;
  submitted: boolean = false;
  token: string = '';
  firstName: string = '';
  lastName: string = '';
  loading: boolean = false;
  redirectUrl: string = '';
  errorMessage: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
  ) {
  }

  ngOnInit(): void {
    this.loginDetail = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  // ✅ Cleaner access to form controls
  get f() {
    return this.loginDetail.controls;
  }

  markAllAsTouched(): void {
    this.loginDetail.markAllAsTouched();
  }

  onSubmit(): void {
    this.submitted = true;

    if (this.loginDetail.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loading = true;

    this.authService.loginUser(this.loginDetail.value).subscribe({
      next: (response: any) => {
        this.loading = false;
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('firstName', response.data.user.firstName);
        localStorage.setItem('lastName', response.data.user.lastName);

        this.authService.updateAuthState(true); // Notify about login
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.loading = false;
        this.toast.showError('Invalid email or password');
      },
    });
  }
}
