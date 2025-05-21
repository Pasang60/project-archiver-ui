import {Component, HostListener, Inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser, ViewportScroller} from '@angular/common';
import {NavigationEnd, Router} from '@angular/router';
import {AuthService} from '../../auth/service/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit{
  isAuthenticated = false;
  currentUser:  any | null = null;
  username: string | null = null;

  dropdownOpen = false;

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
      const initials = this.getInitials({ firstName, lastName });
      this.currentUser = { firstName, lastName, fullName, username: fullName, initials };
    }
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }

  logout(): void {
    // Clear localStorage and reset state
    localStorage.clear();
    this.isAuthenticated = false;
    this.currentUser = null;
  }

  getInitials(user: any | null): string {
    if (!user) return '';

    const firstInitial = user.firstName.charAt(0);
    const lastInitial = user.lastName.charAt(0);

    return `${firstInitial}${lastInitial}`;
  }
}
