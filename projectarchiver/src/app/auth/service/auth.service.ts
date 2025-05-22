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

  private authState = new BehaviorSubject<boolean>(this.isLoggedIn());

  getAuthState(): Observable<boolean> {
    return this.authState.asObservable();
  }

  updateAuthState(isAuthenticated: boolean): void {
    this.authState.next(isAuthenticated);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
    this.updateAuthState(false);
  }


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

  createArchive(files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, file.name);
    });
    return this.http.post(`${this.apiUrl}/archive`, formData);
  }
}
