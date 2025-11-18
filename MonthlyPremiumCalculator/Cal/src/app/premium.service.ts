import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface PremiumRequest {
  name: string;
  ageNextBirthday: number;
  dateOfBirth: string; // mm/YYYY
  usualOccupation: string;
  deathSumInsured: number;
}

export interface PremiumResponse {
  monthlyPremium: number;
  occupationRating: string;
  ratingFactor: number;
}

@Injectable({ providedIn: 'root' })
export class PremiumService {
  private apiUrl = 'https://localhost:7281/api/Premium'; // adjust to your API url

  constructor(private http: HttpClient) {}

  calculate(req: PremiumRequest): Observable<PremiumResponse> {
    return this.http.post<PremiumResponse>(this.apiUrl, req);
  }
}
