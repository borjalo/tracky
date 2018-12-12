import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseService } from "../../app/services/firebase-service";
import { Subscription } from "rxjs";
import { userToken } from "../../app/services/userToken";


@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})

export class OrderListPage implements OnInit {
  public items: Array<any> = [];
  private orders: any = [];
  private subscripcion:Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebase: FirebaseService,
              private userLogin:userToken) {
  }

  ngOnInit() {
    let list = [];
    this.subscripcion = this.firebase.getOrders().subscribe(res => {
      if(this.userLogin.getLogin().tipo == "deliveryman"){

        for(let order of res) {
         if((this.userLogin.getLogin().nombre == order.deliveryman && order.state != "Entregado")){
           list.push(order);
         }
        }
        this.orders = list;
      } else {
        list = [];
        for(let order of res) {
          if(order.state != "Entregado") {
            list.push(order);
          }
        }
        this.orders = list;
      }
    });
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }

  createOrder() {
    this.navCtrl.push("CreateOrderPage");
  }

  goToOrder(index) {
    const orderId = this.orders[index].id;
    this.navCtrl.push("ConfirmDelivererPage", {
      id: orderId,
    });
  }

}
