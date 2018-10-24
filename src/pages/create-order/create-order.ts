import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
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
    client: "",
    position: new firebase.firestore.GeoPoint(39.481270, -0.359374),
    deliveryTime: new Date().toISOString(),
    price: 0,
    articles: [],
    state: "Preparado",
    deliveryman: "Pedro",
  };

  private clients: any;
  private quantity: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseClient: FirebaseServiceClients,
              private firebaseOrder: FirebaseService,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController) {

    this.firebaseClient.getClients().subscribe(res => {
      this.clients = res;
    });
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
    if (this.order.client == "e7YVbvR3HRsZhGpYi291") {
      this.order.position = new firebase.firestore.GeoPoint(39.481270, -0.359374)
    } else if(this.order.client == "jj3QhUutZk2RQ6Pt74YQ") {
      this.order.position = new firebase.firestore.GeoPoint(39.466827, -0.382990)
    }
    const loading = this.loadingCtrl.create({
      content: 'Creando pedido...'
    });
    loading.present();

    this.firebaseOrder.addOrder(this.order).then(() => {
      loading.dismiss();
      this.navCtrl.pop();
    });
  }

  addArticles() {
    const articleModal = this.modalCtrl.create("ArticleListPage");
    articleModal.present();

    articleModal.onDidDismiss((d: any) => {
      if(d) {
        for (let article of d) {
          if (article.quantity > 0) {
            this.order.articles.push(article);
            this.order.price += (article.price * article.quantity);
          }
        }
      }
    });
  }

}
