import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, ModalController, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceClients } from "../../app/services/firebase-clients";
import { FirebaseService, Order } from '../../app/services/firebase-service';
import * as firebase from 'firebase';
import { Subscription } from "rxjs";

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

  latLng: any;
  deliveryAddress: any = "Select delivery address";

  private clients: any;
  private quantity: number = 0;
  private sub:Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private firebaseClient: FirebaseServiceClients,
              private firebaseOrder: FirebaseService,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController) {

    this.sub=this.firebaseClient.getClients().subscribe(res => {
      this.clients = res;
    });
  }

  selectDeliveryAddress() {
    // Create the modal
    const modal = this.modalCtrl.create("SelectAddressPage");

    // Present the modal
    modal.present();

    // User closes the modal
    modal.onDidDismiss(
      (data: any) => {
        if (data) {

          // Sets origin longitude and latitude
          this.latLng = data.latLng;

          // Sets origin address
          this.deliveryAddress = data.street;
        }
      },
    );
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
    this.order.position._lat = this.latLng.lat();
    this.order.position._long = this.latLng.lng();
    const loading = this.loadingCtrl.create({
      content: 'Creando pedido...'
    });
    loading.present().then(() => {
      this.firebaseOrder.addOrder(this.order).then(() => {
        loading.dismiss().then(() => {
          this.navCtrl.pop();
        });

      }).catch(() => {
        let errorAlert = this.alertCtrl.create({
          title: 'Error creating order',
          subTitle: 'Try again in a few minutes',
          buttons: ['OK']
        });
        errorAlert.present();

      });
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
