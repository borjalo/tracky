import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Category {
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
export class FirebaseServiceCategories {
  private categoriesCollection: AngularFirestoreCollection<Category>;

  private categories: Observable<Category[]>;

  constructor(db: AngularFirestore) {
    this.categoriesCollection = db.collection<Category>('categories');

    this.categories = this.categoriesCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getCategories() {
    return this.categories;
  }

  getCategory(id) {
    return this.categoriesCollection.doc<Category>(id).valueChanges();
  }

  updateCategory(article: Category, id: string) {
    return this.categoriesCollection.doc(id).update(article);
  }

  addCategory(article: Category) {
    return this.categoriesCollection.add(article);
  }

  removeCategory(id) {
    return this.categoriesCollection.doc(id).delete();
  }
}
