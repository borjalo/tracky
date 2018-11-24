import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {userToken} from "../../app/services/userToken";
import {AngularFireAuth} from "angularfire2/auth";
/**
 * Generated class for the HomeDeliverymanPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-home-deliveryman',
  templateUrl: 'home-deliveryman.html',
})
export class HomeDeliverymanPage {

  usuario:any;
  constructor(private afAuth:AngularFireAuth,
              public navCtrl: NavController,
              public userLogin:userToken,
              public navParams: NavParams,
              private alertCtrl: AlertController) {}


  ngOnInit() {
    this.checkLogin();
  }

  checkLogin() {

    let usuarioLogeado=this.userLogin.getLogin();
  }

  showMap () {
    this.navCtrl.push("MapPage");
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
              this.navCtrl.setRoot("LoginPage");
            });
          }
        },
      ]
    });
    alertSignOut.present();
  }

  showLogin() {
    this.afAuth.auth.signOut().then(() => {
      this.navCtrl.setRoot("LoginPage")
    })
  }

}

