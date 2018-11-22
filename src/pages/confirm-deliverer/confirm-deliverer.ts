import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { FirebaseServiceClients } from "../../app/services/firebase-clients";
import { FirebaseService, Order } from '../../app/services/firebase-service';
import * as firebase from 'firebase';
import { userToken } from "../../app/services/userToken";
import { NotificationToAdminCore } from "../../app/services/notificationsToAdmin";
import { HttpClient } from "@angular/common/http";
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Geolocation } from '@ionic-native/geolocation';
import { Deliveryman, FirebaseServiceDeliveryMans } from '../../app/services/firebase-deliverymans';

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

  deliveryman: Deliveryman =  {
    position: new firebase.firestore.GeoPoint(39.481270, -0.359374),
    name: "",
    order: ""
  };

  address: any;

  clientName: any;
  orderId = "";

  geocoder: any;

  latLng: any;

  deliverymans: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseClient: FirebaseServiceClients,
              private firebaseOrder: FirebaseService,
              private alertCtrl: AlertController,
              private user:userToken,
              private httpClient: HttpClient,
              private notificationToAdmin:NotificationToAdminCore,
              public locationAccuracy: LocationAccuracy,
              public geolocation: Geolocation,
              public loadingCtrl: LoadingController,
              private firebaseDm: FirebaseServiceDeliveryMans,
              private toastCtrl: ToastController) {

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

  delivered() {
    const confirm = this.alertCtrl.create({
      title: 'Attention',
      message: 'Do you want to deliver this order?',
      buttons: [
        {
          text: 'No',
        },
        {
          text: 'Yes',
          handler: () => {
            this.order.state = "Entregado";
            new Promise(resolve => {this.httpClient.get("http://www.lapinada.es/fcm/fcm_tracky_entregado.php?titulo=Pedido entregado!&descripcion="+this.orderId+" entregado por "+this.order.deliveryman).subscribe(data => {
              resolve(data);
            }, err => {
              console.log(err);
            });
            });
            let aviso = {
              order: this.orderId,
              to: "Admin",
              from: this.order.deliveryman
            };
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
      title: 'Attention',
      message: 'Are you sure you want to deliver this order?',
      buttons: [
        {
          text: 'No',
          role:'cancel',
        },
        {
          text: 'Yes',
          handler: () => {
            this.getCurrentLocation();
          }
        }
      ]
    });
    confirm.present();
  }

  getCurrentLocation() {
    // Request activate location
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if (canRequest) {

        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {

            // Create loading toast
            const loading = this.loadingCtrl.create({
              content: "Obteniendo ubicación actual...",
              spinner: "dots",
            });

            // Present loading toast
            loading.present().then(() => {
              const positionOptions = {
                enableHighAccuracy: true,
                maximumAge: 600000,
                timeout: 7000,
              };

              this.geolocation.getCurrentPosition(positionOptions).then((position) => {
                alert(position.coords.latitude);
                let userName = this.user.getLogin().nombre;
                this.order.deliveryman = userName;
                this.deliveryman.name = userName;

                this.order.state = "En reparto";
                this.firebaseOrder.updateOrder(this.order, this.orderId);
                this.deliveryman.order = this.orderId;
                this.deliveryman.position._lat = position.coords.latitude;
                this.deliveryman.position._lng = position.coords.longitude;
                alert(this.deliveryman.position._lat + ' ' + this.deliveryman.position._lng);

                this.firebaseDm.addDeliveryman(this.deliveryman);
                loading.dismiss().then(() => {
                  this.navCtrl.pop().then(() => {
                    let toastOrderBeingDelivered = this.toastCtrl.create({
                      message: 'Order in the way!',
                      duration: 3000,
                      position: 'bottom'
                    });
                    toastOrderBeingDelivered.present();
                  });
                });
              }).catch(() => {
                loading.dismiss().then(() => {
                  // If error create and present alert
                  const alertErrorLocation = this.alertCtrl.create({
                    buttons: ["Aceptar"],
                    message: "Error al obtener la ubicación",
                  });
                  alertErrorLocation.present();
                });

              })
            });
          },

          // If error requesting location permissions
          (error: any) => {
            const alertWhenNoPermissions = this.alertCtrl.create({
              buttons: ["Aceptar"],
              message: "Error al solicitar los permisos de geolocalización",
            });
            alertWhenNoPermissions.present();
          },
        );
      }
    });
  }

}
