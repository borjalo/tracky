import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {Order} from "./firebase-service";

export interface User {
  tipo:String;
  nombre:String;

}

// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class userToken {
  private user:User;



  constructor() {
    this.user=<User>{};
    this.user.nombre="";
    this.user.tipo="";
  }

  getLogin() {
    return this.user;
  }


  login(user:User) {
    this.user=user;
  }


}
