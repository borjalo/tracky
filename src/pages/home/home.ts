import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, MenuController} from 'ionic-angular';
import {User, userToken} from "../../app/services/userToken";
import {Item, NotificationToAdminCore} from "../../app/services/notificationsToAdmin";
import {AngularFireAuth} from "angularfire2/auth";
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
  isAdmin = false;

  constructor(private afAuth:AngularFireAuth,public navCtrl: NavController,public notificationToAdmin:NotificationToAdminCore,
              public userLogin:userToken,public navParams: NavParams,public alertCtrl:AlertController, public menu:MenuController

  ) 
  {}
  
  ngOnInit(){
    this.checkLogin();
  }
  checkLogin(){

    var usuarioLogeado=this.userLogin.getLogin();
    console.log(usuarioLogeado);
    this.isAdmin = this.userLogin.getLogin().tipo=="admin" ? true : false;
    console.log(this.isAdmin);
  }
  showMap () {
    this.navCtrl.push("MapPage");
  }

  createOrder () {
    this.navCtrl.push("CreateOrderPage");
  }

  showOrders () {
    this.navCtrl.push("OrderListPage");
  }

  showLogin(){
    this.afAuth.auth.signOut().then(() => {
      this.navCtrl.push("LoginPage");
    });
  }

  createArticle () {
    this.navCtrl.push("NewArticlePage");
  }

  showArticles () {
    this.navCtrl.push("ArticleManagerPage");
  }

  showSettings () {
    this.navCtrl.push("SettingsPage");
  }

}
