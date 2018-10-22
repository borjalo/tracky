import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Client {
  id?: string;
  name: any;
  address: any;
}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class FirebaseServiceClients {
  private clientsCollection: AngularFirestoreCollection<Client>;

  private clients: Observable<Client[]>;

  constructor(db: AngularFirestore) {
    this.clientsCollection = db.collection<Client>('clients');

    this.clients = this.clientsCollection.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getClients() {
    return this.clients;
  }

  getClient(id) {
    return this.clientsCollection.doc<Client>(id).valueChanges();
  }

  updateClient(client: Client, id: string) {
    return this.clientsCollection.doc(id).update(client);
  }

  addClient(client: Client) {
    return this.clientsCollection.add(client);
  }

  removeClient(id) {
    return this.clientsCollection.doc(id).delete();
  }
}
