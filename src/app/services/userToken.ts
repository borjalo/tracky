import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import {Observable, Subscription} from 'rxjs';
import { map } from 'rxjs/operators';
import {Order} from "./firebase-service";
import {FirebaseServiceUsers} from "./firebase-users";

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
export class userToken {
  private registeredUsers=[];
  private user:User;
private subscription:Subscription;


  constructor(private dbusers:FirebaseServiceUsers) {

    this.subscription= this.dbusers.getOrders().subscribe(res => {
      this.registeredUsers = res;
    });

  }



  getLogin() {
    return this.user;
  }


  login(email:string) {
    for(let i=0;i<this.registeredUsers.length;i++){
      if(this.registeredUsers[i].email==email) {
        this.user = this.registeredUsers[i]
      }
    }



  }


}
