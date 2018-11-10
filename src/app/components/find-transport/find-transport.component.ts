/// <reference types="@types/googlemaps" />
import { Component, OnInit } from '@angular/core';
import { PlaceInput } from '../../interfaces/PlacesInterface';

@Component({
  selector: 'app-find-transport',
  templateUrl: './find-transport.component.html',
  styleUrls: ['./find-transport.component.css']
})
export class FindTransportComponent implements OnInit {

  private toLocationString:string;
  private fromLocationString:string;

  private toPlace:google.maps.places.PlaceResult;
  private fromPlace:google.maps.places.PlaceResult;

  constructor() { }

  ngOnInit() {
  }

  onPlaceUpdate(newPlace:PlaceInput, fieldName:string) {
    if(fieldName === 'from') {
      this.fromLocationString = newPlace.queryString
      this.fromPlace = newPlace.placeObj
    } else {
      this.toLocationString = newPlace.queryString
      this.toPlace = newPlace.placeObj
    }
    console.log(newPlace)
  }



}
