import { Component } from '@angular/core';
import { AlertController, LoadingController, NavController, IonicPage, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';
import { Deliveryman, FirebaseServiceDeliveryMans } from '../../app/services/firebase-deliverymans';
import * as firebase from 'firebase';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { userToken } from "../../app/services/userToken";
import { AngularFireAuth } from "angularfire2/auth";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{

  constructor(public navCtrl: NavController,
              public geolocation: Geolocation,
              public firebaseDm: FirebaseServiceDeliveryMans,
              public alertCtrl: AlertController,
              public locationAccuracy: LocationAccuracy,
              public loadingCtrl: LoadingController,
              public androidPermissions: AndroidPermissions,
              private afAuth:AngularFireAuth,
              public userLogin:userToken,
              public navParams: NavParams) {


    /*this.requestPermissionsAndroid();*/

  }

  requestPermissionsAndroid() {
    this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION).then(() => {
      this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION)
        .then((result) => {
          if (result.hasPermission) {
            // Permissions given
          } else if (!result.hasPermission) {
            // If error create and present alert
            const alertErrorPermissions = this.alertCtrl.create({
              buttons: [{
                text: "OK",
                handler: () => {
                  this.requestPermissionsAndroid();
                }
              }],
              enableBackdropDismiss: false,
              message: "Make sure you give permission to Tracky to work the best for you",
            });
            alertErrorPermissions.present();
          }
        }).catch(() => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION);
      });
    });
  }

  ngOnInit() {
    this.checkLogin();
  }

  checkLogin() {
    let usuarioLogeado = this.userLogin.getLogin();
  }

  showMap () {
    this.navCtrl.push("MapPage");
  }

  createOrder () {
    this.navCtrl.push("CreateOrderPage");
  }

  showOrders () {
    this.navCtrl.push("OrderListPage");
  }

  signOut() {
    let alertSignOut = this.alertCtrl.create({
      title: "Are you sure you want to log out?",
      buttons: [
        {
          text: "No",
          role: "cancel",
        },
        {
          text: "Yes",
          handler: () => {
            this.afAuth.auth.signOut().then(() => {
              this.navCtrl.push("LoginPage");
            });
          }
        },
      ]
    });
    alertSignOut.present();

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
}
