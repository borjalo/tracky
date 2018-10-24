import { Component } from '@angular/core';
import { IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceClients } from "../../app/services/firebase-clients";
import { FirebaseService, Order } from '../../app/services/firebase-service';
import * as firebase from 'firebase';

@IonicPage()
@Component({
  selector: 'page-create-order',
  templateUrl: 'create-order.html',
})
export class CreateOrderPage {
  order: Order = {
    name: "",
    client: "",
    deliveryTime:"",
    state:"",
    position: new firebase.firestore.GeoPoint(39.481270, -0.359374),
  };
  private clients: any;
  private quantity: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseClient: FirebaseServiceClients,
              private firebaseOrder: FirebaseService,
              private loadingCtrl: LoadingController) {

    this.firebaseClient.getClients().subscribe(res => {
      this.clients = res;
      console.log(this.clients)
    });
  }

  ionViewDidLoad() {

  }

  remove() {
    if(this.quantity > 0) {
      this.quantity -= 1;
    }
  }

  add(){
    this.quantity += 1;
  }

  createOrder() {
    const loading = this.loadingCtrl.create({
      content: 'Creando pedido...'
    });
    loading.present();

    this.firebaseOrder.addOrder(this.order).then(() => {
      loading.dismiss();
      this.navCtrl.pop();
    })
  }

}
