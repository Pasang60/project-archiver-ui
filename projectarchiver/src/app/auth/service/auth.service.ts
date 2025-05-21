import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {FormGroup} from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient,

  ) { }
  public apiUrl = environment.baseUrl;


  registerUsers(signupData: any): Observable<any>{
    return this.http.post(`${this.apiUrl}/users/register`, signupData);
  }

  loginUser(loginDetail: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, loginDetail);
  }

  checkOtp(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/users/validate`, data);
  }

  updatePassword(data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/users/set-password`, data);
  }
}
