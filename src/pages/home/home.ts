import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Deliveryman, FirebaseServiceDeliveryMans } from '../../app/services/firebase-deliverymans';
import * as firebase from 'firebase';
import { AndroidPermissions } from '@ionic-native/android-permissions';

import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {User, userToken} from "../../app/services/userToken";
import {Item, NotificationToAdminCore} from "../../app/services/notificationsToAdmin";
import {AngularFireAuth} from "angularfire2/auth";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  deliveryman: Deliveryman =  {
    position: new firebase.firestore.GeoPoint(39.481270, -0.359374),
    name: "Pedro",
    order: ""
  };

  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public firebaseDm: FirebaseServiceDeliveryMans,
              public alertCtrl: AlertController,
              public locationAccuracy: LocationAccuracy,
              public loadingCtrl: LoadingController,
              public androidPermissions: AndroidPermissions) {


    this.requestPermissionsAndroid();

  }

  requestPermissionsAndroid() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(() => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
        .then((result) => {
          if (result.hasPermission) {
            this.getCurrentLocation();
          } else if (!result.hasPermission) {
            // If error create and present alert
            const alertErrorPermissions = this.alertCtrl.create({
              buttons: [{
                text: "Aceptar",
                handler: data => {
                  this.requestPermissionsAndroid();
                }
              }],
              enableBackdropDismiss: false,
              message: "Asegúrate de darle permisos a Tracky para que trabaje lo mejor para ti",
            });
            alertErrorPermissions.present();
          }
        }).catch(() => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
      });
    });
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
                this.deliveryman.position._lat = position.coords.latitude;
                this.deliveryman.position._lng = position.coords.longitude;
                this.firebaseDm.addDeliveryman(this.deliveryman);
                loading.dismiss().then(() => {
                  let watch = this.geolocation.watchPosition();
                  watch.subscribe((data) => {
                    this.deliveryman.position = new firebase.firestore.GeoPoint(data.coords.latitude, data.coords.longitude);
                    this.firebaseDm.updateDeliveryman(this.deliveryman, this.deliveryman.id);
                  })
                });
              }).catch(() => {
                loading.dismiss();
                // If error create and present alert
                const alertErroLocation = this.alertCtrl.create({
                  buttons: ["Aceptar"],
                  message: "Error al obtener la ubicación",
                });
                alertErroLocation.present();
              })
            });
          },

  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController,public notificationToAdmin:NotificationToAdminCore,
              public userLogin:userToken,public navParams: NavParams,public alertCtrl:AlertController

  ) {}
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


  ngOnInit(){
    this.checkLogin();
  }
  checkLogin(){

    var usuarioLogeado=this.userLogin.getLogin();
    console.log(usuarioLogeado);
  }
  showMap () {
    this.navCtrl.push("MapPage", {
      orders: true,
      deliverers: false
    });
  }

  createOrder () {
    this.navCtrl.push("CreateOrderPage");
  }

  showOrders () {
    this.navCtrl.push("OrderListPage");
  }

  showLogin(){
    this.afAuth.auth.signOut().then(() => {
      this.navCtrl.push("LoginPage");
    });
  }

  createArticle () {
    this.navCtrl.push("NewArticlePage");
  }

  showArticles () {
    this.navCtrl.push("ArticleManagerPage");
  }

  showSettings () {
    this.navCtrl.push("SettingsPage");
  }

  showDeliverers() {
    this.navCtrl.push("MapPage", {
      deliverers: true,
      orders: false
    });
  }
}
