import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {User, userToken} from "../../app/services/userToken";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage{
usuario:any;
  constructor(public navCtrl: NavController,
              public userLogin:userToken

  ) {}


  ngOnInit(){
    this.checkLogin();
  }
  checkLogin(){
    this.usuario=<User>{};
    this.usuario.nombre="prueba";
    this.usuario.tipo="tipoPrueba";
    this.userLogin.login(this.usuario);
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
