import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LandingPageComponent} from './landing-page/landing-page.component';
import {SignUpComponent} from './auth/sign-up/sign-up.component';

const routes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'signup', component: SignUpComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
