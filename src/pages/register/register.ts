import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { userToken } from "../../app/services/userToken";

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  private email: string = "";
  private password: string = "";
  private confirmPassword: string = "";

  constructor(
              private alerController: AlertController,
              private afAuth: AngularFireAuth,
              private loadingController: LoadingController,
              public navCtrl: NavController,
              public navParams: NavParams,
              private usersToken: userToken,
  ) {}

  signup(){
    if(this.email == ""){
      this.alerController.create({
        title: "Error",
        subTitle: "Email void or incorrect",
        buttons:['OK'],
      }).present();
    }else if (this.password == this.confirmPassword){
      this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password).then(() => {

      });
    }
  }

}
