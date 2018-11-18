import { Component , ViewChild} from '@angular/core';
import {Nav,NavController, Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AngularFireAuth} from "angularfire2/auth";

import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {userToken} from "./services/userToken";
import {Subscription} from "rxjs";
import {FirebaseServiceUsers} from "./services/firebase-users";
import {HomeDeliverymanPage} from "../pages/home-deliveryman/home-deliveryman";
import {NewArticlePage} from "../pages/new-article/new-article";
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
 //rootPage:any = HomePage;
  @ViewChild(Nav) nav: Nav
private subscription:Subscription;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private afAuth:AngularFireAuth,private userLogin:userToken,private dbusers:FirebaseServiceUsers) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });


  }
ngOnInit(){this.testLogin();}

  testLogin(){

    this.afAuth.auth.onAuthStateChanged((user)=>{
    if(user){
      this.subscription= this.dbusers.getOrders().subscribe(res => {
        this.userLogin.login(user.email);
        if(this.userLogin.getLogin().tipo=="deliveryman"){
          this.nav.push("HomeDeliverymanPage");
        }else {
          this.nav.push(HomePage)
        }


        this.subscription.unsubscribe();
      });


    }
    else{
      this.subscription= this.dbusers.getOrders().subscribe(res => {
        this.nav.push("LoginPage");
        this.subscription.unsubscribe();
      });

    }

  });}


}

