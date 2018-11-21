import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {HomePage} from "../home/home";
import {userToken} from "../../app/services/userToken";
import {HomeDeliverymanPage} from "../home-deliveryman/home-deliveryman";
import {NotificationByPlatfrom} from "../../app/services/notificationByPlatform";


@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private user;
  private email= "";
  private password= "";
  constructor(private alertCtrl:AlertController,private notificationConfig:NotificationByPlatfrom,private afAuth:AngularFireAuth, private usersToken:userToken ,public navCtrl: NavController, public navParams: NavParams) {

  }

  login(){
    this.afAuth.auth.signInWithEmailAndPassword(this.email, this.password).then(() => {
      this.usersToken.login(this.getUser().email);
      //console.log(this.usersToken.getLogin());

      if(this.usersToken.getLogin().tipo=="deliveryman"){
        this.navCtrl.push("HomeDeliverymanPage");
      }else{
      this.navCtrl.push(HomePage);}
      this.notificationConfig.start();
    }).catch(() => {
      let alert = this.alertCtrl.create({
        title: "Error de inicio de sesión",
        subTitle: "Compruebe su usuario y contraseña",
        buttons: ['Ok']
      });
      alert.present();
    })
  }
  register(){
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
  }

  getUser(){
    var usuario = this.afAuth.auth.currentUser;
    return usuario;
  }

}
