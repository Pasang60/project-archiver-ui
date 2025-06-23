import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../common/api.service';
import { ToastService } from '../common/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
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
  ) {}

  ngOnInit() {
    this.profileForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      address: [''],
      profilePic: [null]

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
        initials: this.getUserInitials({ firstName, lastName })
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
        this.profileImagePreview = this.profile?.profilePicture || '';
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
    const inputElement = event.target as HTMLInputElement | null;
    if (inputElement && inputElement.files && inputElement.files.length > 0) {
      const file: File = inputElement.files.item(0)!;
      this.profileForm.patchValue({ profilePic: file });
      this.isPresentFile = true;

      const reader = new FileReader();
      reader.onload = () => {
        this.profileImagePreview = reader.result;
      };
      reader.readAsDataURL(file);
    } else {
      this.isPresentFile = false;
    }
  }

  saveProfile() {
    this.submitted = true;
    this.profileForm.markAllAsTouched();

    if (!this.profileForm.valid) {
      this.toast.showError('Please fill in all required fields');
      return;
    }

    this.isLoading = true;

    const updatedProfile = new FormData();
    updatedProfile.append('firstName', this.f['firstName'].value);
    updatedProfile.append('lastName', this.f['lastName'].value);
    updatedProfile.append('email', this.f['email'].value);
    updatedProfile.append('address', this.f['address'].value);
    updatedProfile.append('phone', this.f['phoneNumber'].value);


    if (this.isPresentFile && this.profileForm.get('profilePic')?.value) {
      updatedProfile.append('profilePic', this.profileForm.get('profilePic')?.value);
      this.sendFormData(updatedProfile);
    } else if (this.profile?.profilePicture) {
      fetch(this.profile.profilePicture)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'existing-profile.jpg', { type: blob.type });
          updatedProfile.append('profilePic', file);
          this.sendFormData(updatedProfile);
        })
        .catch(err => {
          console.error('Failed to fetch existing image:', err);
          this.toast.showError('Could not prepare existing image');
          this.isLoading = false;
        });
    } else {
      this.sendFormData(updatedProfile);
    }
  }

  sendFormData(formData: FormData) {
    this.apiService.updateProfile(formData).subscribe({
      next: (response: any) => {
        const updatedData = response.data;

        localStorage.setItem('firstName', updatedData.firstName);
        localStorage.setItem('lastName', updatedData.lastName);
        localStorage.setItem('email', updatedData.email);

        this.currentUser = {
          firstName: updatedData.firstName,
          lastName: updatedData.lastName,
          fullName: `${updatedData.firstName} ${updatedData.lastName}`,
          initials: this.getUserInitials(updatedData)
        };

        this.toast.showSuccess(response.message || 'Profile updated successfully');
        this.loadProfile();
        this.isPresentFile = false;
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.toast.showError(error.error?.message || 'Update failed');
        this.isLoading = false;
      }
    });
  }
}
