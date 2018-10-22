import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { FirebaseService } from "../../app/services/firebase-service";

declare var google;



@IonicPage()
@Component({
  selector: 'page-map',
  templateUrl: 'map.html',
})
export class MapPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  latLng: any;
  //pedido:Pedido;
  public lista;
  private orders: any = [];


  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public plt: Platform,
              private geolocation: Geolocation,
              private firebase: FirebaseService) {}

  ngOnInit() {
    this.loadMap();

    this.firebase.getOrders().subscribe(res => {
      this.orders = res;
      for (let order of this.orders) {
        this.addMarker(order);
      }
    });


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

  addMarker(order: any) {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(order.position.latitude, order.position.longitude)
    });

    let content = order.name;

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
