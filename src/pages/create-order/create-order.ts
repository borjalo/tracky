import { Component } from '@angular/core';
import { IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceClients } from "../../app/services/firebase-clients";
import { FirebaseService, Order } from '../../app/services/firebase-service';
import * as firebase from 'firebase';
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NotificationToAdminCore} from "../../app/services/notificationsToAdmin";


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
   description: "",
    price: 0,
    articles: [],
    state: "Preparado",
    deliveryman: "",
  };

  private clients: any;
  private quantity: number = 0;
  private sub:Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseClient: FirebaseServiceClients,
              private firebaseOrder: FirebaseService,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private httpClient: HttpClient,
              private notificationToDeliveres:NotificationToAdminCore) {

    this.sub=this.firebaseClient.getClients().subscribe(res => {
      this.clients = res;
    });
  }
ngOnDestroy(){
    this.sub.unsubscribe();
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
      var titulo="Hay un nuevo pedido";
      var descripcion="Se acaba de añadir un nuevo pedido";

      new Promise(resolve => {this.httpClient.get("http://www.lapinada.es/fcm/fcm_tracky_nuevopedido.php?titulo="+titulo+"&descripcion="+descripcion).subscribe(data => {
        resolve(data);
      }, err => {
        console.log(err);
      });
      });
      let aviso={order:"pedido",to:"repartidores",from:"admin"
      }
      this.notificationToDeliveres.update2(aviso);

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
