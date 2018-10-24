import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceClients } from "../../app/services/firebase-clients";
import { FirebaseService, Order } from '../../app/services/firebase-service';
import * as firebase from 'firebase';
import {Observable} from "rxjs";

declare var google;

@IonicPage()
@Component({
  selector: 'page-confirm-deliverer',
  templateUrl: 'confirm-deliverer.html',
})
export class ConfirmDelivererPage implements OnInit {

  @ViewChild('map') mapElement: ElementRef;
  map: any;

  order: Order ={
    client: "",
    position: new firebase.firestore.GeoPoint(39.481270, -0.359374),
    deliveryTime: "",
    price: 0,
    articles:[],
    state:"",
    deliveryman: "",
  };
  address: any;

  clientName: any;
  orderId = "";

  geocoder: any;

  latLng: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseClient: FirebaseServiceClients,
              private firebaseOrder: FirebaseService,
              private alertCtrl: AlertController) {

    this.orderId = this.navParams.get("id");

  }

  ngOnInit() {
    this.geocoder =  new google.maps.Geocoder();
    this.firebaseOrder.getOrder(this.orderId).subscribe(res => {
      this.order = res;
      this.firebaseClient.getClient(this.order.client).subscribe(r => {
        this.clientName = r.name;
      });
      this.latLng = new google.maps.LatLng(this.order.position.latitude, this.order.position.longitude);
      this.loadMap(this.latLng);
      this.addMarker(this.latLng);
      this.geocode(this.latLng);
    });


  }

  loadMap(latLng) {

    // Map options
    const mapOptions = {
      center: latLng,
      disableDefaultUI: true,
      gestureHandling: "greedy",
      mapTypeId: google.maps.MapTypeId.ROADMAP,
      zoom: 12,
    };

    // Create the map with the options defined
    this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
  }

  geocode(latLng) {
    this.geocoder.geocode({location: latLng}, (result, status) => {
      if (status === 'OK') {
        if (result[0]) {
          this.address = result[0].formatted_address;
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }
    })
  }

  addMarker(latLng) {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: new google.maps.LatLng(latLng.lat(), latLng.lng())
    });

  }

  onCatchDelivery(){
    this.confirmDelivery();
  }

  confirmDelivery() {
    const confirm = this.alertCtrl.create({
      title: 'Atención',
      message: '¿Está seguro de que desea repartir este pedido?',
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Sí',
          handler: () => {
            this.order.deliveryman = "deliveryman1";
            this.order.state = "En reparto";
            this.firebaseOrder.updateOrder(this.order, this.orderId).then(() => {
              this.navCtrl.pop();
            });
          }
        }
      ]
    });
    confirm.present();
  }

}
