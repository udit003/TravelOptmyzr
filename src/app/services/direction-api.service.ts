import { Injectable } from '@angular/core';
import { Observable,Observer } from 'rxjs';
import { DirectionApiResponse } from '../interfaces/RouteInterface';

@Injectable({
  providedIn: 'root'
})
export class DirectionApiService {

  constructor() { }


  findAllRoutes(origin:any,destination:any,travelMode:google.maps.TravelMode):Observable<DirectionApiResponse>{

    return Observable.create(observer => {
      var service = new google.maps.DirectionsService();
      service.route(
        {
          origin:origin,
          destination:destination,
          travelMode:travelMode,
          provideRouteAlternatives:true
        } , (response, status) => {
          observer.next({status:status,directionResult:response})
          observer.complete()
        } 
      )
    });
  }

  // direction api helper
}