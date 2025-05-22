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
    this.authService.getAuthState().subscribe((isAuthenticated) => {
      this.isAuthenticated = isAuthenticated;

      if (isAuthenticated) {
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const fullName = `${firstName} ${lastName}`;
        const initials = this.getInitials({ firstName, lastName });
        this.currentUser = { firstName, lastName, fullName, username: fullName, initials };
      } else {
        this.currentUser = null;
      }
    });
  }

  logout(): void {
    this.authService.logout(); // Use AuthService to handle logout
  }

  toggleDropdown(): void {
    this.dropdownOpen = !this.dropdownOpen;
  }


  getInitials(user: any | null): string {
    if (!user) return '';

    const firstInitial = user.firstName.charAt(0);
    const lastInitial = user.lastName.charAt(0);

    return `${firstInitial}${lastInitial}`;
  }
}
