import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { CartPage } from "../shoppingCart/shoppingCart";
import { Storage } from '@ionic/storage';

@Component({
  selector: 'page-articleList',
  templateUrl: 'articleList.html'
})
export class ArticleListPage {

  private storage = new Storage(localStorage);

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

  constructor(public navCtrl: NavController) {

  }

  private currentQuantity = 0;

  private increment (selectedName: string) {
    var i = 0;
    for(i=0; i<=this.items.length; i++) {

      if(this.items[i].name == selectedName){
        this.items[i].quantity++;
      }

    }
  }

  private decrement (selectedName: string) {
    var i = 0;
    for(i=0; i<=this.items.length; i++) {

      if(this.items[i].name == selectedName){
        this.items[i].quantity--;
      }

    }
  }


  itemSelected(item: string) {
    console.log("Selected Item", item);
  }

  goToCart() {
    this.storage.set('items',this.items);
    this.navCtrl.setRoot(CartPage);
  }

}
