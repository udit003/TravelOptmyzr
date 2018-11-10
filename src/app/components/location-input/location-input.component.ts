import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { LocationQueryService } from '../../services/location-query.service';
import { FormControl } from '@angular/forms';
import { PlaceInput } from '../../interfaces/PlacesInterface';

@Component({
  selector: 'location-input',
  templateUrl: './location-input.component.html',
  styleUrls: ['./location-input.component.css']
})
export class LocationInputComponent implements OnInit {
  
  @Input() placeholderData:string;

  @Output() newPlaceInput = new EventEmitter<PlaceInput>();

  @ViewChild('locationInput') locationInputRef: ElementRef;

  private element:HTMLInputElement;

  queryString:FormControl;
  tempData = "dummy";
  constructor(private locationQueryService:LocationQueryService) { }

  ngOnInit() {
    this.element = this.locationInputRef.nativeElement;

    const autocomplete = new google.maps.places.Autocomplete(this.element);
    
    google.maps.event.addListener(autocomplete,'place_changed',() => {
      console.log("Directive Event listener called");
      this.newPlaceInput.emit({queryString:this.queryString.value,placeObj:autocomplete.getPlace()})
    });

    this.queryString = new FormControl();
    this.queryString.valueChanges
      .subscribe(term => {
        // this.locationQueryService.getSuggestedLocation(term)
        // .subscribe(data => {
        //   this.tempData = data.predictions
        
        this.newPlaceInput.emit({queryString:term,placeObj:null})
       })
  }

}
