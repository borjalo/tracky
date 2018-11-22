import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceArticles, Article } from '../../app/services/firebase-articles';
import { FirebaseServiceCategories } from "../../app/services/firebase-categories";
import { Subscription } from "rxjs";

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
              private alertCtrl: AlertController) {

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

  editArticle(id) {

    this.navCtrl.push("NewArticlePage",{id: id});

  }

  deleteArticle(id) {
    let deleteArticleAlert = this.alertCtrl.create({
      buttons: [
        {
          text: "No",
          role: 'cancel'
        },
        {
          text: "Yes",
          handler: () => {
            this.firebaseArticle.removeArticle(id);
          }
        }
        ],
      enableBackdropDismiss: false,
      message: "Are you sure you want to delete this article?",
    })
    deleteArticleAlert.present();


  }



}
