import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import { AngularFireAuth} from "angularfire2/auth";
import { HomePage} from "../home/home";
import { userToken} from "../../app/services/userToken";
import { HomeDeliverymanPage} from "../home-deliveryman/home-deliveryman";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private user;
  private email= "";
  private password= "";
  constructor(private afAuth: AngularFireAuth,
              private usersToken:userToken,
              public navCtrl: NavController,
              public navParams: NavParams,
              public alertCtrl: AlertController) {

  }

  login(){
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
      this.usersToken.login(this.getUser().email);
      if(this.usersToken.getLogin().tipo=="deliveryman") {
        this.navCtrl.push("HomeDeliverymanPage");
      } else {
        this.navCtrl.push("HomePage");}
    }).catch(() => {
      let errorAlert = this.alertCtrl.create({
        title: "Wrong credentials. Please try again.",
        buttons: ['OK']
      });
      errorAlert.present();
    })
  }

  register() {
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
  }

  getUser() {
    let usuario = this.afAuth.auth.currentUser;
    return usuario;
  }

}
