import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController  } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { FirebaseServiceUsers, User } from "../../app/services/firebase-users";


@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {

  user: any;
  newPsw: string = "";
  oldPsw: string = "";
  confPsw: string = "";

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseUsers: FirebaseServiceUsers,
              private auth: AngularFireAuth,
              private alertController: AlertController) {

  }

  changePassword(){
      if(this.newPsw === this.confPsw){
        this.auth.auth.currentUser.updatePassword(this.newPsw).then(() =>  {
          this.alertController.create({
            title: "Password reset",
            subTitle: "Passwords changed",
            buttons:[{
              text: 'OK',
              handler: () => {
                this.navCtrl.pop();
              }
            }],
          }).present();
        });
      } else {
        this.alertController.create({
          title: "Password error",
          subTitle: "Passwords don't match",
          buttons:['Retry'],
        }).present();
      }
  }
}
