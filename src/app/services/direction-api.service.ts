import { Injectable } from '@angular/core';
import { Observable,Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DirectionApiService {

  constructor() { }


  findAllRoutes(origin:any,destination:any,travelMode:google.maps.TravelMode):Observable<any>{

    return Observable.create(observer => {
      var service = new google.maps.DirectionsService();
      service.route(
        {
          origin:origin,
          destination:destination,
          travelMode:travelMode
        } , (response, status) => {
          observer.next(response)
          observer.complete()
        } 
      )
    });
  }
}