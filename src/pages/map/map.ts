import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

declare var google;

@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  latLng: any;
  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public plt: Platform,
              private geolocation: Geolocation) {
  }

  ionViewDidLoad() {
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

}
