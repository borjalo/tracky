import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";
import {HomePage} from "../home/home";
import {userToken} from "../../app/services/userToken";
import {HomeDeliverymanPage} from "../home-deliveryman/home-deliveryman";

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
  private user;
  private email= "";
  private password= "";
  constructor(private afAuth:AngularFireAuth, private usersToken:userToken ,public navCtrl: NavController, public navParams: NavParams) {

  }

  login(){
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(this.email, this.password).then(() => {
      this.usersToken.login(this.getUser().email);
      //console.log(this.usersToken.getLogin());

      if(this.usersToken.getLogin().tipo=="deliveryman"){
        this.navCtrl.push("HomeDeliverymanPage");
      }else{
      this.navCtrl.push(HomePage);}
    }).catch(() => {
      console.log("Login malo")
    })
  }
  register(){
    this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password)
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  patata(){
    console.log("Login bueno")
  }

  getUser(){
    var usuario = this.afAuth.auth.currentUser;
    return usuario;
  }

  ngOnInit(){


  }

}
