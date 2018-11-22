import { Component } from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  ModalController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import { FirebaseServiceClients } from "../../app/services/firebase-clients";
import { FirebaseService, Order } from '../../app/services/firebase-service';
import * as firebase from 'firebase';
import {Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {NotificationToAdminCore} from "../../app/services/notificationsToAdmin";
import { Storage} from "@ionic/storage";


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

  commentsVisible: boolean = false;
  listVisible: boolean = false;

  latLng: any;
  deliveryAddress: any = "";

  private clients: any;
  private quantity: number = 0;
  private sub:Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private alertCtrl: AlertController,
              private firebaseClient: FirebaseServiceClients,
              private firebaseOrder: FirebaseService,
              private loadingCtrl: LoadingController,
              private modalCtrl: ModalController,
              private httpClient: HttpClient,
              private notificationToDeliveres:NotificationToAdminCore,
              private  storage:Storage,
              public toastCtrl: ToastController) {

    this.sub=this.firebaseClient.getClients().subscribe(res => {
      this.clients = res;
    });

    this.storage.get("TypeView").then((data) =>{
      if(data == "comments") {
        this.commentsVisible = true;
        this.listVisible = false;
      } else if(data == "list") {
        this.commentsVisible = false;
        this.listVisible = true;
      } else if(data == "both") {
        this.commentsVisible = true;
        this.listVisible = true;
      }
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

  ngOnDestroy() {
      this.sub.unsubscribe();
  }

  createOrder() {
    this.order.position._lat = this.latLng.lat();
    this.order.position._long = this.latLng.lng();
    const loading = this.loadingCtrl.create({
      content: 'Creando pedido...'
    });
    loading.present().then(() => {

    this.firebaseOrder.addOrder(this.order).then(() => {
      let titulo="Hay un nuevo pedido";
      let descripcion ="Se acaba de añadir un nuevo pedido";

      new Promise(resolve => {this.httpClient.get("http://www.lapinada.es/fcm/fcm_tracky_nuevopedido.php?titulo="+titulo+"&descripcion="+descripcion).subscribe(data => {
        resolve(data);
      }, err => {
      });
      });
      let aviso={order:"pedido",to:"repartidores",from:"admin"
      }
      this.notificationToDeliveres.update2(aviso);

      loading.dismiss().then(() => {
        this.navCtrl.pop().then(() => {
          let toast = this.toastCtrl.create({
            message: 'Order created successfully',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
        });
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
