import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.scss'
})
export class SignUpComponent implements OnInit {
  signupForm: FormGroup;
  profileImagePreview: string | ArrayBuffer | null = null;

  constructor(private fb: FormBuilder,
              private router: Router) {
    this.signupForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      address: [''],
      profilePic: [null]
    });
  }

  ngOnInit(): void {
  }

  // Handle profile image preview
  onProfileImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files?.[0]) { // Add null-safe check for files
      const file = fileInput.files[0];

      // Update form control value with the file
      this.signupForm.patchValue({
        profilePic: file
      });

      // Create a preview of the image
      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // Form submission handler
  onSubmit(): void {
    if (this.signupForm.valid) {
      // Here you would normally send the form data to your backend service
      console.log('Form submitted successfully!', this.signupForm.value);

      // If you need to send the form data including the file, you would use FormData
      const formData = new FormData();

      // Append form field values
      Object.keys(this.signupForm.controls).forEach(key => {
        if (key === 'profilePic') {
          if (this.signupForm.get('profilePic')?.value) {
            formData.append('profilePic', this.signupForm.get('profilePic')?.value);
          }
        } else {
          formData.append(key, this.signupForm.get(key)?.value);
        }
      });

      // Now you can use this formData with your HTTP service
      // this.userService.registerUser(formData).subscribe(response => { ... });

      alert('Form submitted successfully!');
    } else {
      // Mark all fields as touched to trigger validation messages
      this.signupForm.markAllAsTouched();
    }
  }
}
