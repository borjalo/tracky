import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {AngularFireStorage,AngularFireUploadTask} from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Order {
  id?: string;
  position: any;
  deliveryTime: any;
  client: any;
  price: any;
  articles: Array<any>;
  state: any;
  deliveryman: any;
  description: string;
  comment:string;
}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class SignatureProvider {

  constructor(db: AngularFirestore, private storage:AngularFireStorage) {

  }
uploadToStorage(information):AngularFireUploadTask{
    let newName=`${new Date().getTime()}.jpg`;
    return this.storage.ref(`files/${newName}`).putString(information);
}

}
