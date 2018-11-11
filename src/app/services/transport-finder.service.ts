import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlaceInput,PlacesQuery } from '../interfaces/PlacesInterface';
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import {RouteResponseState,RouteResponseData,ResultState} from '../interfaces/RouteInterface';
import { DirectionApiService } from './direction-api.service';
import { filter, switchMap, tap } from 'rxjs/operators';
 
@Injectable({
  providedIn: 'root'
})
export class TransportFinderService {

  // input pipe
  findTransportSubject:Subject<PlacesQuery> = new Subject();

  // output meta data pipe
  routeResponseState:BehaviorSubject<RouteResponseState> = new BehaviorSubject(RouteResponseState.SUCCESS);

  // output data pipe
  routeResponseData:BehaviorSubject<RouteResponseData> = new BehaviorSubject({resultState:ResultState.NO_RESULT}); 

  constructor(private directionApiService:DirectionApiService) {
    this.findTransportSubject.pipe(
      filter(data => this.validateLocations(data.origin,data.destination)),
      tap(() =>  this.routeResponseData.next({resultState:ResultState.FETCHING_RESULT})),
      switchMap(data => 
        forkJoin(
          [directionApiService.findAllRoutes(this.getLocationQueryString(data.origin),this.getLocationQueryString(data.destination),google.maps.TravelMode.DRIVING),
          directionApiService.findAllRoutes(this.getLocationQueryString(data.origin),this.getLocationQueryString(data.destination),google.maps.TravelMode.TRANSIT)])
        )
      )
      .subscribe(result => {
        // now I need to 
        console.log(result);
      })


   }

  findAllRoutes(origin:PlaceInput,destination:PlaceInput){
    this.routeResponseData.next({resultState:ResultState.FETCHING_RESULT});
    // I have an observable, I have two observables using which I want to 

  }

  makeHttpRequest(origin:PlaceInput,destination:PlaceInput){
     
  }

  private validateLocations(origin:PlaceInput,destination:PlaceInput) : boolean {
    // console.log(origin);
    // console.log(destination);

    if((origin.placeObj==null && origin.queryString === '')){
      this.routeResponseState.next(RouteResponseState.INVALID_ORIGIN);
      return false;
    } else if((destination.placeObj==null && destination.queryString === '')){
      this.routeResponseState.next(RouteResponseState.INVALID_DESTINATION);
      return false;
    } else{
      this.routeResponseState.next(RouteResponseState.WAITING);
      return true;
    }
  }

  private getLocationQueryString(location:PlaceInput):any {
    var locationString:any;
    if(location.placeObj==null) 
      locationString = location.queryString;
    else 
      locationString =  {lat:location.placeObj.geometry.location.lat(),lng:location.placeObj.geometry.location.lng()};

      //console.log(locationString);
      return locationString
  }

}
