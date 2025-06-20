import {Component, ElementRef, OnInit, signal, ViewChild} from '@angular/core';
import {AuthService} from '../auth/service/auth.service';
import {ApiService} from '../common/api.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastService} from '../common/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})

export class ProfileComponent implements OnInit {

  profileForm!: FormGroup;
  isAuthenticated = false;
  currentUser: any = null;
  profile: any = null;
  isLoading = true;
  isPresentFile = false;
  submitted = false;
  profileImagePreview: string | ArrayBuffer | null = '';
  imageTypeError: boolean = false;

  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private toast: ToastService
  ) {
  }

  ngOnInit() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      profilePic: [null, Validators.required]
    });

    this.loadProfile();

    const token = localStorage.getItem('token');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    if (token && firstName && lastName) {
      this.isAuthenticated = true;
      const fullName = `${firstName} ${lastName}`;
      this.currentUser = {
        firstName,
        lastName,
        fullName,
        initials: this.getUserInitials({firstName, lastName})
      };
    }
  }

  get f() {
    return this.profileForm.controls;
  }

  getUserInitials(user: any | null): string {
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
  }

  loadProfile() {
    this.apiService.getProfile().subscribe({
      next: (response) => {
        this.profile = response.data;
        this.profileForm.patchValue(this.profile);
        this.profileImagePreview = this.profile?.profilePicture || ''; // Set the image preview
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.toast.showError('Failed to load profile');
        this.isLoading = false;
      }
    });
  }


  onProfileImageSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;

    if (fileInput.files?.[0]) {
      const file = fileInput.files[0];
      this.profileForm.patchValue({ profilePic: file });
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

  saveProfile() {
    this.submitted = true;
    this.profileForm.markAllAsTouched();

    if (this.profileForm.valid) {
      const updatedProfile = new FormData();
      updatedProfile.append('firstName', this.f['firstName'].value);
      updatedProfile.append('lastName', this.f['lastName'].value);
      updatedProfile.append('email', this.f['email'].value);
      updatedProfile.append('address', this.f['address'].value);
      updatedProfile.append('phone', this.f['phoneNumber'].value);

      // Append profilePic only if a file is selected
      if (this.isPresentFile && this.profileForm.get('profilePic')?.value) {
        updatedProfile.append('profilePic', this.profileForm.get('profilePic')?.value);
      }

      console.log('Updated Profile Data:', updatedProfile); // Debugging

      this.apiService.updateProfile(updatedProfile).subscribe({
        next: (response) => {
          console.log('API Response:', response); // Debugging
          this.toast.showSuccess('Profile updated successfully');
          this.loadProfile(); // Reload profile to reflect changes
          this.isPresentFile = false;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error updating profile:', error); // Debugging
          this.toast.showError(error.error?.message || 'Update failed');
          this.isLoading = false;
        }
      });
    } else {
      this.toast.showError('Please fill in all required fields');
      this.isLoading = false;
    }
  }
}

