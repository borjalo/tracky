import {Component, OnInit} from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { FirebaseService } from "../../app/services/firebase-service";


@IonicPage()
@Component({
  selector: 'page-order-list',
  templateUrl: 'order-list.html',
})

export class OrderListPage implements OnInit {
  public items: Array<any> = [];
  private orders: any = [];

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebase: FirebaseService) {
  }

  ngOnInit() {
    this.firebase.getOrders().subscribe(res => {
      this.orders = res;
    });
  }

  createOrder () {
    this.navCtrl.push("CreateOrderPage");
  }

}
