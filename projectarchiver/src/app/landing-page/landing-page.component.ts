import { Component } from '@angular/core';
import {AuthService} from '../auth/service/auth.service';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponent {

  constructor(private authService: AuthService) {
  }
}
