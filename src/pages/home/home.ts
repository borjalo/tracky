import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { userToken } from "../../app/services/userToken";
import { AngularFireAuth } from 'angularfire2/auth';

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{

  usuario:any;
  constructor(public navCtrl: NavController,
              public userLogin:userToken,public navParams: NavParams,
              public auth: AngularFireAuth) {}


  ngOnInit(){
    this.checkLogin();
  }
  checkLogin(){

    let usuarioLogeado=this.userLogin.getLogin();
    console.log(usuarioLogeado);
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
    this.navCtrl.push("LoginPage");
  }

  createArticle () {
    this.navCtrl.push("NewArticlePage");
  }

  showArticles () {
    this.navCtrl.push("ArticleManagerPage");
  }

  signOut() {
    this.auth.auth.signOut().then(() => {
      this.navCtrl.push("LoginPage");
    });
  }

}
