import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {AuthService} from '../service/auth.service';
import {ToastService} from '../../common/toast.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']  // Fixed typo: `styleUrl` ➜ `styleUrls`
})
export class SignUpComponent implements OnInit {
  signupForm! : FormGroup;
  profileImagePreview: string | ArrayBuffer | null = '';
  imageTypeError: boolean = false;
  isPresentFile: boolean = false;
  submitted: boolean = false;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private toast: ToastService
    ) {

  }

  ngOnInit(): void {
    this.signupFormInitialization();
  }

  signupFormInitialization(): void {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)]],
      profilePic: ['', [Validators.required]],
      address: ['', [Validators.required]],
      phone: ['', [Validators.required, Validators.pattern(/(?:\(?\+977\)?)?9[6-9]\d{8}|01-?[0-9]{7}/)]],
    });
  }

  // ✅ Add this getter for cleaner template access
  get f() {
    return this.signupForm.controls;
  }

  onProfileImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files?.[0]) {
      const file = fileInput.files[0];
      this.signupForm.patchValue({ profilePic: file });
      this.isPresentFile = true; // Set to true when a file is selected

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.isPresentFile = false; // Reset if no file is selected
    }
  }

  onSubmit(): void {
    this.submitted = true;
    this.signupForm.markAllAsTouched();

    this.loading = true; // Start spinner

    if (this.signupForm.valid && this.isPresentFile && !this.imageTypeError) {
      const signupFormData = new FormData();
      signupFormData.append('fullName', this.f['fullName'].value);
      signupFormData.append('email', this.f['email'].value);
      signupFormData.append('profilePic', this.f['profilePic'].value);
      signupFormData.append('address', this.f['address'].value);
      signupFormData.append('phone', this.f['phone'].value);


      this.authService.registerUsers(signupFormData).subscribe({
        next: () => {
          this.toast.showSuccess('Users registered successfully.');
          localStorage.setItem('email', this.f['email'].value);

          this.router.navigate(['/auth/otp-verify']);

        },
        error: (error: any) => {
          this.loading = false; // Stop spinner
          this.toast.showError(error.error.message);
        }
      });
    }
    else{
      this.signupForm.markAllAsTouched();
    }
  }
}
