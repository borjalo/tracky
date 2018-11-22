import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from "../../app/services/firebase-service";
import { FirebaseServiceDeliveryMans } from '../../app/services/firebase-deliverymans';
import { Subscription } from "rxjs";
import { userToken } from "../../app/services/userToken";

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
  private orders: any = [];
  private markers = [];
  private suscription: Subscription;
  viewingOrders: boolean;
  viewingDeliverers: boolean;
  private deliverymans: any = [];
  private suscripcionDm: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebase: FirebaseService,
              private userLogin:userToken,
              public firebaseDm: FirebaseServiceDeliveryMans) {

    this.viewingOrders = this.navParams.get("orders");
    this.viewingDeliverers = this.navParams.get("deliverers");
  }

  ngOnInit() {

    this.loadMap();


    this.suscription = this.firebase.getOrders().subscribe(res => {
      this.orders = res;

      for (let order of this.orders) {
        if(order.state == "En reparto") {

          if(this.userLogin.getLogin().nombre == order.deliveryman) {
            this.addMarkerOrder(order);
          } else if(this.userLogin.getLogin().tipo == "admin") {
            this.addMarkerOrder(order);
          }
        }
      }
    });

    this.suscripcionDm = this.firebaseDm.getDeliverymans().subscribe((res) => {
      this.deliverymans = res;

      for (let dm of this.deliverymans) {
        this.addMarkerDm(dm)
      }
    });
  }

  ngOnDestroy() {
    this.deleteAllMarkers();
    this.suscription.unsubscribe();
    this.suscripcionDm.unsubscribe();
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

  addMarkerOrder(order: any) {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(order.position.latitude, order.position.longitude),
      icon: 'assets/order-marker.png',
    });
    this.markers.push(marker);
    let content = order.client.name;

    this.addInfoWindow(marker, content);

  }

  addMarkerDm(dm: any) {
    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(dm.position.latitude, dm.position.longitude),
      icon: 'assets/dm-marker.png',
    });
    this.markers.push(marker);
    let content = dm.name;

    this.addInfoWindow(marker, content);

  }

  deleteAllMarkers() {
    for (let i = 0; i < this.markers.length; i++) {
      this.markers[i].setMap(null);
    }
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
