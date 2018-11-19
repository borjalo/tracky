import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Deliveryman {
  id?: string;
  position: any;
  name: any;
  order: any;
}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceDeliveryMans {
  private deliverymansCollection: AngularFirestoreCollection<Deliveryman>;

  private deliverymans: Observable<Deliveryman[]>;

  constructor(db: AngularFirestore) {


    this.deliverymansCollection = db.collection<Deliveryman>('deliverymans-position');
    this.deliverymans = this.deliverymansCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getDeliverymans() {
    return this.deliverymans;
  }

  getDeliveryman(id) {
    return this.deliverymansCollection.doc<Deliveryman>(id).valueChanges();
  }

  updateDeliveryman(dm: Deliveryman, id: string) {
    return this.deliverymansCollection.doc(id).update(dm);
  }

  addDeliveryman(dm: Deliveryman) {
    return this.deliverymansCollection.add(dm);
  }

  removeDeliveryman(id) {
    return this.deliverymansCollection.doc(id).delete();
  }
}
