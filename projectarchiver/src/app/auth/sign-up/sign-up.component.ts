import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']  // Fixed typo: `styleUrl` ➜ `styleUrls`
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  profileImagePreview: string | ArrayBuffer | null = null;
  submitted = false; // ✅ Add this

  constructor(private fb: FormBuilder, private router: Router) {
    this.signupForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      address: ['', Validators.required],
      profilePic: [null, Validators.required] // ✅ Add required validator
    });

  }

  ngOnInit(): void {}

  // ✅ Add this getter for cleaner template access
  get f() {
    return this.signupForm.controls;
  }

  onProfileImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files?.[0]) {
      const file = fileInput.files[0];
      this.signupForm.patchValue({ profilePic: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    this.submitted = true; // Set submitted to true

    if (this.signupForm.valid) {
      const formData = new FormData();
      Object.keys(this.signupForm.controls).forEach(key => {
        const control = this.signupForm.get(key);
        if (key === 'profilePic' && control?.value) {
          formData.append('profilePic', control.value);
        } else {
          formData.append(key, control?.value);
        }
      });

      console.log('Form Data:', this.signupForm.value);
      alert('Form submitted successfully!');
    }
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }
  }
}
