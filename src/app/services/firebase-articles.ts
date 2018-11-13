import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Article {
  id?: string;
  name: string;
  description:string;
  price:number;
  category:string;

}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceArticles {
  private articlesCollection: AngularFirestoreCollection<Article>;

  private articles: Observable<Article[]>;

  constructor(db: AngularFirestore) {
    this.articlesCollection = db.collection<Article>('articles');

    this.articles = this.articlesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getArticles() {
    return this.articles;
  }

  getArticle(id) {
    return this.articlesCollection.doc<Article>(id).valueChanges();
  }

  updateArticle(article: Article, id: string) {
    return this.articlesCollection.doc(id).update(article);
  }

  addArticle(article: Article) {
    return this.articlesCollection.add(article);
  }

  removeArticle(id) {
    return this.articlesCollection.doc(id).delete();
  }
}
