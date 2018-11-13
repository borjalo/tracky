import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
//import { ArticleListPage } from "../articleList/articleList";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-cart',
  templateUrl: 'shoppingCart.html'
})
export class CartPage {

  items = [
    {name:'Croissant', quantity:0},
    {name:'Napolitana', quantity:0},
    {name:'Susú', quantity:0},
    {name:'Bomba rellena', quantity:0},
    {name:'Caña crema', quantity:0},
    {name:'Rosquilletas', quantity:0}
    /*'Super Metroid',
    'Mega Man X',
    'The Legend of Zelda',
    'Pac-Man',
    'Super Mario World',
    'Street Fighter II',
    'Half Life',
    'Final Fantasy VII',
    'Star Fox',
    'Tetris',
    'Donkey Kong III',
    'GoldenEye 007',
    'Doom',
    'Fallout',
    'GTA',
    'Halo'*/
  ];

  public storageItems: any;

  constructor(public navCtrl: NavController, public storage: Storage) {

  }

  getAllFavorites(list: Array<Object>) {
    var promise = new Promise((resolve, reject) => {
      this.storage.forEach((value, key, index) => {
        list.push(value);
      }).then((d) => {
        resolve(list);
      });
    });
    return promise;
  }

  ionViewWillEnter() {
    this.storage.get('items').then((val) => {
      this.storageItems = val;
    });
    //this.storageItems = this.storage.get("items");
    /*this.getAllFavorites(this.storageItems).then((val) => {
      this.storage.forEach(val,(v,k)=> {
        this.storageItems.push(v);
      });
    });*/
  }

  private currentQuantity = 0;

  private increment (selectedName: string) {
    var i = 0;
    for(i=1; i<=this.items.length; i++) {

      if(this.items[i].name == selectedName){
        this.items[i].quantity++;
      }

    }
  }

  private decrement (selectedName: string) {
    var i = 0;
    for(i=1; i<=this.items.length; i++) {

      if(this.items[i].name == selectedName){
        this.items[i].quantity--;
      }

    }
  }


  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  goToArticles() {
    //this.navCtrl.setRoot(ArticleListPage);
  }

}
