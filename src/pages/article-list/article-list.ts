import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-article-list',
  templateUrl: 'article-list.html',
})
export class ArticleListPage {
  articles = [
    {name:'Croissant', quantity:0, price:4.5},
    {name:'Napolitana', quantity:0, price: 2.4},
    {name:'Susú', quantity:0, price: 1.5},
    {name:'Bomba rellena', quantity:0, price: 3},
    {name:'Caña crema', quantity:0, price: 2},
    {name:'Rosquilletas', quantity:0, price: 3.2}
    ];
  totalPrice: any = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private viewCtrl: ViewController) {
  }

  remove(item) {
    if(item.quantity > 0) {
      item.quantity -= 1;
      this.totalPrice -= item.price;
    }
  }

  add(item){
    item.quantity += 1;
    this.totalPrice += item.price;
  }

  ok() {
    this.viewCtrl.dismiss(this.articles);
  }

  closeView() {
    this.viewCtrl.dismiss();
  }

}
