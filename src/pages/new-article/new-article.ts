import { Component } from '@angular/core';
import { AlertController, IonicPage, LoadingController, NavController, NavParams } from 'ionic-angular';
import { FirebaseServiceArticles, Article } from '../../app/services/firebase-articles';
import { FirebaseServiceCategories } from "../../app/services/firebase-categories";
import { Subscription } from "rxjs";

@IonicPage()
@Component({
  selector: 'page-new-article',
  templateUrl: 'new-article.html',
})
export class NewArticlePage {

  article: Article = {
    name: "",
    description: "",
    category: "",
    price: null
  };

  totalPrice: any = 0;

  categories: any;
  articles: any;
  articleToEditID: any;
  articleToEdit: any;
  articleExistFlag: any;
  private sub:Subscription;
  private sub2:Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseArticle: FirebaseServiceArticles,
              private firebaseCategory: FirebaseServiceCategories,
              private loadingCtrl: LoadingController,
              private alertCtrl: AlertController) {

    this.sub = this.firebaseCategory.getCategories().subscribe(res => {
      this.categories = res;
    });

    this.sub2 = this.firebaseArticle.getArticles().subscribe(res => {
      this.articles = res;
    });

    this.articleToEditID = this.navParams.get("id");

    if(this.articleToEditID != undefined) {
      this.firebaseArticle.getArticle(this.articleToEditID).subscribe(res => {
        this.articleToEdit = res;
        this.article.name = res.name;
        this.article.description = res.description;
        this.article.price = res.price;
        this.article.category = res.category;
      });
    }

  }

  ngOnDestroy(){
    this.sub.unsubscribe();
    this.sub2.unsubscribe();
  }

  createArticle(newArticle) {

    this.article.name = newArticle.name;
    this.article.description = newArticle.description;
    this.article.price = newArticle.price;
    this.article.category = newArticle.category;

    const articleFlag = this.articleExists(this.article.name);

    if( articleFlag == true ) {

      const error = this.alertCtrl.create({
        title: 'Artículo existente',
        subTitle: 'Este artículo ya existe',
        buttons: ['OK']
      })

      error.present();

    } else if(this.article.name == null || this.article.category == null || this.article.price == null) {

      const error = this.alertCtrl.create({
        title: 'Artículo inválido',
        subTitle: 'Indique un nombre, precio y categoría',
        buttons: ['OK']
      })

      error.present();

    } else {

      const loading = this.loadingCtrl.create({
        content: 'Creando artículo...'
      });
      loading.present().then(() => {
        this.firebaseArticle.addArticle(this.article).then(() => {
          loading.dismiss();
          this.navCtrl.pop();
        });
      });
    }
  }

  updateArticle(id, articleEdited) {

    this.article.name = articleEdited.name;
    this.article.description = articleEdited.description;
    this.article.price = articleEdited.price;
    this.article.category = articleEdited.category;

    const loading = this.loadingCtrl.create({
      content: 'Actualizando artículo...'
    });
    loading.present().then(() => {

      this.firebaseArticle.updateArticle(articleEdited, id).then(() => {
        loading.dismiss();
        this.navCtrl.pop();
      });
    });

  }

  articleExists(name) {

    for( let article of this.articles ) {
      if(article.name == name) {
        this.articleExistFlag = true;
      }
    }

    return this.articleExistFlag;

  }

}
