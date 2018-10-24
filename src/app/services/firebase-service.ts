import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Order {
  id?: string;
  position: any;
  deliveryTime: any;
  client: any;
  prize: any;
  articles: Array<any>;
  state: any;
}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  private ordersCollection: AngularFirestoreCollection<Order>;

  private orders: Observable<Order[]>;

  constructor(db: AngularFirestore) {
    this.ordersCollection = db.collection<Order>('orders');

    this.orders = this.ordersCollection.snapshotChanges().pipe(
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
    return this.ordersCollection.doc<Order>(id).valueChanges();
  }

  updateOrder(order: Order, id: string) {
    return this.ordersCollection.doc(id).update(order);
  }

  addOrder(order: Order) {
    return this.ordersCollection.add(order);
  }

  removeOrder(id) {
    return this.ordersCollection.doc(id).delete();
  }
}
