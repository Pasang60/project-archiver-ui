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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from 'ngx-toastr';
import {HttpClientModule} from '@angular/common/http';
import { OtpComponent } from './auth/otp/otp.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { ProfileComponent } from './profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    TestimonialComponent,
    SignUpComponent,
    OtpComponent,
    DashboardComponent,
    FileUploaderComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      preventDuplicates: true,
      positionClass: 'toast-top-center'
    }),
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
