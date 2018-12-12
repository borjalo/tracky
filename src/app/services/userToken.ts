import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { FirebaseServiceUsers } from "./firebase-users";
import { Observable } from 'rxjs';

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

  private registeredUsers = [];
  private user: User;
  private subscription:Subscription;
  public configObservable:any;

  constructor(private dbusers: FirebaseServiceUsers) {

    this.subscription = this.dbusers.getUsers().subscribe(res => {
      this.registeredUsers = res;
    });

  }

  getObservable(){
    this.configObservable = Observable.create(observer => {
      this.configObservable = observer;
      this.configObservable.next(this.user);
    });


    return this.configObservable;
  }

  getLogin() {
    return this.user;
  }

  login(email:string) {
    for(let i=0; i<this.registeredUsers.length; i++) {
      if(this.registeredUsers[i].email == email) {
        this.user = this.registeredUsers[i];
        this.configObservable.next(this.user);
        this.subscription.unsubscribe();
      }
    }
  }
}
