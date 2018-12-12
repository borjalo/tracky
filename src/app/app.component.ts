import { Component , ViewChild} from '@angular/core';
import { Nav,  Platform} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import {AngularFireAuth} from "angularfire2/auth";

import { HomePage } from '../pages/home/home';
import {LoginPage} from "../pages/login/login";
import {userToken} from "./services/userToken";
import {Subscription} from "rxjs";
import {FirebaseServiceUsers} from "./services/firebase-users";
import {NotificationByPlatfrom} from "./services/notificationByPlatform";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  username= "wait";
  usermail= "wait";
 //rootPage:any = HomePage;
  @ViewChild(Nav) nav: Nav
  private subscription:Subscription;
  private subscriptions:Subscription;

  constructor(private notificationConfig: NotificationByPlatfrom,
              private platform: Platform,
              statusBar: StatusBar,
              splashScreen: SplashScreen,
              private afAuth: AngularFireAuth,
              private userLogin: userToken,
              private dbusers: FirebaseServiceUsers) {

    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }

  ngOnInit(){
    this.testLogin();

  }

  showMap () {
    this.nav.push("MapPage");
  }

  createOrder () {
    this.nav.push("CreateOrderPage");
  }

  showOrders () {
    this.nav.push("OrderListPage");
  }

  showLogin(){
    this.afAuth.auth.signOut().then(() => {
      this.nav.push("LoginPage");
    });
  }

  createArticle () {
    this.nav.push("NewArticlePage");
  }

  showArticles () {
    this.nav.push("ArticleManagerPage");
  }

  showSettings () {
    this.nav.push("SettingsPage");
  }

  testLogin(){
    this.afAuth.auth.onAuthStateChanged((user)=>{
      if(user){
        this.userLogin.getObservable().subscribe(res =>{
          if(res != undefined){
            this.username= res.nombre;
            this.usermail=res.email;}
        });
        this.subscription= this.dbusers.getUsers().subscribe(res => {
          this.userLogin.login(user.email);
          this.nav.setRoot(HomePage);
          this.subscription.unsubscribe();
          this.notificationConfig.start();
        });
      } else {
        this.subscriptions = this.dbusers.getUsers().subscribe(res => {
          //console.log("no user-subscription")
          this.nav.setRoot("LoginPage");
          this.subscriptions.unsubscribe();
        });
      }
    });
  }
}

