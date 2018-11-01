import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {User, userToken} from "../../app/services/userToken";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{

  usuario:any;
  constructor(public navCtrl: NavController,
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

  createOrder () {
    this.navCtrl.push("CreateOrderPage");
  }

  showOrders () {
    this.navCtrl.push("OrderListPage");
  }

  showLogin(){
    this.navCtrl.push("LoginPage");
  }

}
