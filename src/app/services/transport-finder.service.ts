import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PlaceInput,PlacesQuery } from '../interfaces/PlacesInterface';
import { Subject, BehaviorSubject, forkJoin } from 'rxjs';
import {RouteResponseState,RouteResponseData,ResultState,DirectionApiResponse} from '../interfaces/RouteInterface';
import { DirectionApiService } from './direction-api.service';
import { filter, switchMap, tap } from 'rxjs/operators';
import { not } from '@angular/compiler/src/output/output_ast';
 
@Injectable({
  providedIn: 'root'
})
export class TransportFinderService {

  // input pipe
  findTransportSubject:Subject<PlacesQuery> = new Subject();

  // output meta data pipe
  routeResponseState:BehaviorSubject<RouteResponseState> = new BehaviorSubject(RouteResponseState.SUCCESS);

  // output data pipe
  routeResponseData:BehaviorSubject<RouteResponseData> = new BehaviorSubject({resultState:ResultState.NOTHING_TO_SHOW}); 

  constructor(private directionApiService:DirectionApiService) {
    this.findTransportSubject.pipe(
      filter(data => this.validateLocations(data.origin,data.destination)),
      tap(() =>  this.routeResponseData.next({resultState:ResultState.FETCHING_RESULT})),
      switchMap(data => 
        forkJoin(
          [directionApiService.findAllRoutes(
            this.getLocationQueryString(data.origin),
            this.getLocationQueryString(data.destination),google.maps.TravelMode.DRIVING),
          directionApiService.findAllRoutes(
            this.getLocationQueryString(data.origin),
            this.getLocationQueryString(data.destination),google.maps.TravelMode.TRANSIT)
          // directionApiService.findAllRoutes(
          //   this.getLocationQueryString(data.origin),
          //   this.getLocationQueryString(data.destination),
          //   google.maps.TravelMode.WALKING)
          ])
        )
      )
      .subscribe(result => {
        //this.processRouteData(result)
        console.log(result);
      })


   }

   private processRouteData(fetchedResults:DirectionApiResponse[]) : RouteResponseData {
    
    var returnData:RouteResponseData = {resultState:ResultState.UNEXPECTED_ERROR,resultData:null};

    let allDirectionResultObjects = [];

    let zero_results = 0;
    let not_found = 0;
    let other_error = 0;
    let total_requests = fetchedResults.length;

    fetchedResults.forEach(rawResponse => {
      switch(rawResponse.status) {
        case 'OK' : {
          allDirectionResultObjects.push(rawResponse.directionResult);
          break;
        }
        case 'NOT_FOUND' : {
          not_found++;
          break;
        }
        case 'ZERO_RESULTS' : {
          zero_results++;
          break;
        } 
        default : {
          other_error++;
        }

      }
    });

    if(allDirectionResultObjects.length>0) {
      returnData.resultState = ResultState.ROUTES_FOUND;
      returnData.resultData = allDirectionResultObjects;
      this.routeResponseState.next(RouteResponseState.SUCCESS);
      
    } else if (zero_results>0) {
      returnData.resultState = ResultState.NO_ROUTES_FOUND;
      returnData.resultData = null;
      this.routeResponseState.next(RouteResponseState.SUCCESS);

    } else if(not_found>0) {
      returnData.resultState = ResultState.GEOCODING_ERROR;
      returnData.resultData = null;
      this.routeResponseState.next(RouteResponseState.INVALID_ONE_OR_BOTH);
    }

    return returnData;

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
