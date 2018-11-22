import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
export interface Item { order: string;to: string;from: string }

// @ts-ignore
@Injectable({
  providedIn: 'root'
})





export class NotificationToAdminCore {
  private itemDoc: AngularFirestoreDocument<Item>;
  private itemDoc2: AngularFirestoreDocument<Item>;
  item: Observable<Item>;
  item2: Observable<Item>;

  constructor(private afs: AngularFirestore) {

    this.itemDoc = afs.doc<Item>('notificationToAdminCore/1');
    this.item = this.itemDoc.valueChanges();
    this.itemDoc2 = afs.doc<Item>('notificationToAdminCore/2');
    this.item2 = this.itemDoc2.valueChanges();

  }

  update(item: Item) {
    this.itemDoc.update(item);
  }

  getItem() {
    return this.item;
  }

  update2(item: Item) {
    this.itemDoc2.update(item);
  }

  getItem2() {
    return this.item2;
  }
}
