import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

declare var google;

@IonicPage()
@Component({
  selector: 'page-select-address',
  templateUrl: 'select-address.html',
})
export class SelectAddressPage implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  map: any;

  search: any;
  street: any;
  geocoder: any;

  GoogleAutocomplete: any;
  autocomplete: any;
  autocompleteItems: any;
  latLng: any;
  marker: any;
  markers: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public zone: NgZone,
              private  viewCtrl: ViewController) {

    this.geocoder = new google.maps.Geocoder();
    this.GoogleAutocomplete = new google.maps.places.AutocompleteService();
    this.autocomplete = { input: '' };
    this.autocompleteItems = [];
    this.markers = [];
  }

  ngOnInit() {
    this.loadMap();
  }

  private loadMap() {
    this.latLng = new google.maps.LatLng("39.470156", "-0.377324");

    // Map options
    const mapOptions = {
      center: this.latLng,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 12,
    };

    // Create the map with the options defined
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  updateSearchResults(){
    if (this.autocomplete.input == '') {
      this.autocompleteItems = [];
      return;
    }
    this.GoogleAutocomplete.getPlacePredictions({ input: this.autocomplete.input },
      (predictions, status) => {
        this.autocompleteItems = [];
        this.zone.run(() => {
          predictions.forEach((prediction) => {
            this.autocompleteItems.push(prediction);
          });
        });
      });
  }

  selectSearchResult(item){
    this.clearMarkers();
    this.autocompleteItems = [];

    this.geocoder.geocode({'placeId': item.place_id}, (results, status) => {
      if(status === 'OK' && results[0]){
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: this.map
        });
        this.markers.push(marker);
        this.street = results[0].formatted_address;
        this.map.setCenter(results[0].geometry.location);
        this.latLng = results[0].geometry.location;
      }
    })
  }

  clearMarkers(){
    for (let i = 0; i < this.markers.length; i++) {
      console.log(this.markers[i]);
      this.markers[i].setMap(null);
    }
    this.markers = [];
  }

  accept() {
    this.viewCtrl.dismiss({
      latLng: this.latLng, // Marker coords
      street: this.street, // Marker text address
    });
  }

  closeModal() {
    this.viewCtrl.dismiss();
  }

}
