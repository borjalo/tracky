import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Order {
  id?: string;
  geoposition: any;
  name: any;
}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private projectsCollection: AngularFirestoreCollection<Order>;

  private orders: Observable<Order[]>;

  constructor(db: AngularFirestore) {
    this.projectsCollection = db.collection<Order>('orders');

    this.orders = this.projectsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getOrders() {
    return this.orders;
  }

  getOrder(id) {
    return this.projectsCollection.doc<Order>(id).valueChanges();
  }

  updateOrder(order: Order, id: string) {
    return this.projectsCollection.doc(id).update(order);
  }

  addOrder(order: Order) {
    return this.projectsCollection.add(order);
  }

  removeOrder(id) {
    return this.projectsCollection.doc(id).delete();
  }
}
