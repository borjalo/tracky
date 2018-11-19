import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceClients } from "../../app/services/firebase-clients";
import { FirebaseService, Order } from '../../app/services/firebase-service';
import * as firebase from 'firebase';
import {Observable} from "rxjs";
import {userToken} from "../../app/services/userToken";
import {NotificationToAdminCore} from "../../app/services/notificationsToAdmin";
import {HttpClient} from "@angular/common/http";

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
    description: "",
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
              private alertCtrl: AlertController,
              private user:userToken,
              private httpClient: HttpClient,
              private notificationToAdmin:NotificationToAdminCore) {

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

  delivered(){
    const confirm = this.alertCtrl.create({
      title: 'Atención',
      message: '¿Quiere entregar el pedido?',
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Sí',
          handler: () => {
            this.order.state = "Entregado";
            new Promise(resolve => {this.httpClient.get("http://www.lapinada.es/fcm/fcm_tracky_entregado.php?titulo=Pedido entregado!&descripcion="+this.orderId+" entregado por "+this.order.deliveryman).subscribe(data => {
              resolve(data);
            }, err => {
              console.log(err);
            });
            });
            let aviso={order:this.orderId,to:"Admin",from:this.order.deliveryman
            }
            this.notificationToAdmin.update(aviso);
            this.firebaseOrder.updateOrder(this.order, this.orderId).then(() => {
              this.navCtrl.pop();
            });
          }
        }
      ]
    });
    confirm.present();
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
            this.order.deliveryman = this.user.getLogin().nombre;
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
