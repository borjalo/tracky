import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
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
  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController,
              public userLogin:userToken,public navParams: NavParams,

  ) {}


  ngOnInit(){
    this.checkLogin();
  }
  checkLogin(){

    var usuarioLogeado=this.userLogin.getLogin();
    console.log(usuarioLogeado);
  }
  showMap () {
    this.navCtrl.push("MapPage");
  }


  showOrders () {
    this.navCtrl.push("OrderListPage");
  }

  showLogin(){
    this.afAuth.auth.signOut();
    this.navCtrl.push("LoginPage");
  }

}
