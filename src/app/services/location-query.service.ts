/// <reference types="@types/googlemaps" />

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { PlaceApiResponse } from '../interfaces/PlacesInterface';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LocationQueryService {

  api_base_url:string= environment.BASE_MAP_API_URL + "//place/autocomplete/json"

  count= 0;

  //a= new google.maps.places.Autocomplete

  constructor(private http:HttpClient) { }

  getSuggestedLocation(query:string):Observable<PlaceApiResponse> {

    let httpParams = new HttpParams().append('input',query).append('key',environment.MAP_API_KEY);
    
     return this.http.get<PlaceApiResponse>(this.api_base_url,{params : httpParams})

    // return of("dummy "+(this.count++).toString()).pipe(delay(1000))
  } 

}
