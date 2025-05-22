import {Component, OnInit, signal} from '@angular/core';
import {AuthService} from '../auth/service/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit{
  isAuthenticated = false;
  currentUser:  any | null = null;
  username: string | null = null;
  constructor(private authService: AuthService) {

  }

  ngOnInit() {
    // Check if the user is logged in by verifying the token in localStorage
    const token = localStorage.getItem('token');
    const firstName = localStorage.getItem('firstName');
    const lastName = localStorage.getItem('lastName');

    if (token && firstName && lastName) {
      this.isAuthenticated = true;
      const fullName = `${firstName} ${lastName}`;
      const initials = this.getUserInitials({ firstName, lastName });
      this.currentUser = { firstName, lastName, fullName, username: fullName, initials };
    }
  }


  getUserInitials(user: any | null): string {
    if (!user) return '';

    const firstInitial = user.firstName.charAt(0);
    const lastInitial = user.lastName.charAt(0);

    return `${firstInitial}${lastInitial}`;
  }
  }


