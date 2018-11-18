import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import { FirebaseServiceArticles, Article } from '../../app/services/firebase-articles';
import * as firebase from "firebase";
import {Order} from "../../app/services/firebase-service";
import {FirebaseServiceCategories} from "../../app/services/firebase-categories";
import {Subscription} from "rxjs";

@IonicPage()
@Component({
  selector: 'page-article-manager',
  templateUrl: 'article-manager.html',
})
export class ArticleManagerPage {

  article: Article = {
    name: "",
    description: "",
    category: "",
    price: null
  };

  totalPrice: any = 0;

  categories: any;
  articles: any;
  sub: Subscription;
  sub2: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseArticle: FirebaseServiceArticles,
              private firebaseCategory: FirebaseServiceCategories,
              private loadingCtrl: LoadingController,
              private viewCtrl: ViewController) {

    this.sub = this.firebaseCategory.getCategories().subscribe(res => {
      this.categories = res;
    });
    this.sub2 = this.firebaseArticle.getArticles().subscribe(res => {
      this.articles = res;
    });

  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }



  /*ok() {
    this.viewCtrl.dismiss(this.articles);
  }

  closeView() {
    this.viewCtrl.dismiss();
  }

  remove() {
    if(this.quantity > 0) {
      this.quantity -= 1;
    }
  }

  add(){
    this.quantity += 1;
  }*/



      /*var arr =[];
      for(let o in this.categories) {
        if (this.categories.hasOwnProperty(o)) {
          arr.push(this.categories[o]);
        }
      };


    for (let entry of arr) {
      console.log(entry); // 1, "string", false
    }*/




  editArticle(id) {

    this.navCtrl.push("NewArticlePage",{id: id});

  }

  deleteArticle(id) {

    this.firebaseArticle.removeArticle(id);

  }



}
