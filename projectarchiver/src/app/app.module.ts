import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeaderComponent } from './landing-page/header/header.component';
import { FooterComponent } from './landing-page/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { TestimonialComponent } from './landing-page/testimonial/testimonial.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import {ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    TestimonialComponent,
    SignUpComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
      HttpClientModule,
      ToastrModule.forRoot({
        preventDuplicates: true,
        positionClass: 'toast-top-center'
      })
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
