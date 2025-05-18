import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { HeaderComponent } from './landing-page/header/header.component';
import { FooterComponent } from './landing-page/footer/footer.component';
import { LoginComponent } from './auth/login/login.component';
import { HomePageComponent } from './landing-page/home-page/home-page.component';
import { AboutComponent } from './landing-page/about/about.component';
import { FeaturesComponent } from './landing-page/features/features.component';
import { TestimonialComponent } from './landing-page/testimonial/testimonial.component';
import { FaqsComponent } from './landing-page/faqs/faqs.component';
import { SignUpComponent } from './auth/sign-up/sign-up.component';
import {ReactiveFormsModule} from "@angular/forms";

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    HomePageComponent,
    AboutComponent,
    FeaturesComponent,
    TestimonialComponent,
    FaqsComponent,
    SignUpComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
