import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceClients } from "../../app/services/firebase-clients";

@IonicPage()
@Component({
  selector: 'page-create-order',
  templateUrl: 'create-order.html',
})
export class CreateOrderPage {

  private clientSelected: any;
  private clients: any;
  private quantity: number;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebase: FirebaseServiceClients) {

    this.firebase.getClients().subscribe(res => {
      this.clients = res;
      console.log(this.clients)
    });
  }

  ionViewDidLoad() {

  }

  remove() {
    this.quantity -= 1;
  }

  add(){
    this.quantity += 1;
  }

  createOrder() {

  }

}
