import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface User {
  id?: string;
  tipo: string;
  nombre:string;
  email:string;
  password:string;

}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceUsers {
  private usersCollection: AngularFirestoreCollection<User>;

  private users: Observable<User[]>;

  constructor(db: AngularFirestore) {
    this.usersCollection = db.collection<User>('users');

    this.users = this.usersCollection.snapshotChanges().pipe(
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
    return this.users;
  }

  getOrder(id) {
    return this.usersCollection.doc<User>(id).valueChanges();
  }

  updateOrder(user: User, id: string) {
    return this.usersCollection.doc(id).update(user);
  }

  addOrder(user: User) {
    return this.usersCollection.add(user);
  }

  removeOrder(id) {
    return this.usersCollection.doc(id).delete();
  }
}