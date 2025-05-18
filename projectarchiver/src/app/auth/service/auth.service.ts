import { Injectable } from '@angular/core';
import {environment} from '../../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseUrl: string = environment.baseUrl;

  constructor(

  ) { }
  public apiUrl = environment.baseUrl;

  // signup(registerDetail: FormData) {
  //   return this.httpClient.post<any>(`${this.apiUrl}/users/register`, registerDetail);
  // }
}
