import { Component, ElementRef, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import {Geolocation, GeolocationOptions} from '@ionic-native/geolocation';

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
   this.addMarker();
    this.addMarker2();
  }

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }

  addMarker2() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng("39.682327", "-0.277353")
      //  {lat:39.682327, long:-0.277353}
    });

    let content = "<h4>Information!</h4>";

    this.addInfoWindow(marker, content);

  }

  addInfoWindow(marker, content) {

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }







}
