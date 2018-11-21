import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from "../../app/services/firebase-service";
import { Subscription } from "rxjs";
import { FirebaseServiceDeliveryMans } from '../../app/services/firebase-deliverymans';
import {Subscriber, Subscription} from "rxjs";
import {User, userToken} from "../../app/services/userToken";

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
  private markers=[];
  private suscripcion: Subscription;
  viewingOrders: boolean;
  viewingDeliverers: boolean;
  private deliverymans: any = [];
  private suscripcionDm: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebase: FirebaseService,
              private userLogin:userToken
              private firebase: FirebaseService,
              public firebaseDm: FirebaseServiceDeliveryMans) {

    this.viewingOrders = this.navParams.get("orders");
    this.viewingDeliverers = this.navParams.get("deliverers");
    console.log(this.viewingOrders);
    console.log(this.viewingDeliverers);
  }

  ngOnInit() {

    let usuarioLogeado=this.userLogin.getLogin();

    this.loadMap();

    if (this.viewingOrders) {
      this.suscripcion = this.firebase.getOrders().subscribe(res => {
        this.orders = res;

        this.deleteAllMarkers();
        for (let order of this.orders) {
          if(order.state=="En reparto") {
            console.log(this.userLogin.getLogin().nombre)
            console.log(order.deliveryman)

            if(this.userLogin.getLogin().nombre==order.deliveryman) {
              this.addMarker(order);
            } else if(this.userLogin.getLogin().tipo=="admin") {
              this.addMarker(order);
            }
          }
        }
      });
    }

    if (this.viewingDeliverers) {
      this.suscripcionDm = this.firebaseDm.getDeliverymans().subscribe((res) => {
        this.deliverymans = res;

        this.deleteAllMarkers();
        for (let dm of this.deliverymans) {
          this.addMarker(dm)
        }
      });
    }
  }

  ngOnDestroy() {
    this.suscripcion.unsubscribe();
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
    this.markers.push(marker);
    let content = order.deliveryman;

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
