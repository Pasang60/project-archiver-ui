import { Injectable } from '@angular/core';
import {environment} from '../environment/environment';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  baseUrl: string = environment.baseUrl;

  constructor(
    private http: HttpClient,

  ) { }
  public apiUrl = environment.baseUrl;

  getProfile():Observable<any>{
    return this.http.get(`${this.apiUrl}/users/getById`);
  }

  updateProfile(updatedProfile: any) {
    return this.http.put(`${this.apiUrl}/users/update`, updatedProfile);
  }

    createArchive(formData: FormData, endpoint: string, p: { responseType: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/algorithm/compress`, formData);
  }

}
