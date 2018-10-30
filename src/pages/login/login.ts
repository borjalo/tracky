import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {AngularFireAuth} from "angularfire2/auth";

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
  constructor(private afAuth:AngularFireAuth ,public navCtrl: NavController, public navParams: NavParams) {

  }

  login(){
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(this.email, this.password).then(() => {

      this.patata()
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
    console.log(usuario);
  }

  ngOnInit(){

    this.afAuth.auth.onAuthStateChanged((user)=>{
      if(user){
        this.getUser()
        }
      else{console.log("usuario no logeado")}

    });

    // this.afAuth.auth.signOut();
    // this.user = this.afAuth.authState;
    // console.log(this.user);
    // //this.login();
    // if (this.user != null){
    //   this.navCtrl.push("CreateOrderPage");
    // }
  }

}
