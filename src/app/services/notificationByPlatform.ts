import { Injectable } from '@angular/core';

import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AlertController, Platform, ToastController } from "ionic-angular";
import { NotificationToAdminCore } from "./notificationsToAdmin";
import { FcmProvider } from "./fcm";
import { userToken } from "./userToken";


// @ts-ignore
@Injectable({
  providedIn: 'root'
})
export class NotificationByPlatfrom {

  private sub:Subscription;

  constructor(public alertCtrl: AlertController,
              private notificationToAdmin: NotificationToAdminCore,
              private platform: Platform,
              private fcm: FcmProvider,
              private userLogin:userToken,
              private toastCtrl: ToastController) {
  }

  public esMovil() {
    return (!this.platform.is("core")&& !this.platform.is("mobileweb"))
  }

  public esAdmin() {
    return this.userLogin.getLogin().tipo=="admin"
  }

  private initializeAdminWeb(){
    console.log("Iniciando sistema notificaciones Admin web")
    this.sub = this.notificationToAdmin.getItem().subscribe(res=>{
      if(res.order!= "") {
        let alert = this.alertCtrl.create({
          title: "Order nº " + res.order + " delivered!",
          subTitle: 'Delivered by '+ res.from,
          buttons: ['OK']
        });
        alert.present();
        let reset={
          order: "",to: "",from: ""
        };
        this.notificationToAdmin.update(reset);
      }
    });
  }

  private initializeDelivererWeb(){
    this.sub = this.notificationToAdmin.getItem2().subscribe(res=>{
      if(res.order != ""){
        let alert = this.alertCtrl.create({
          title: "New order!",
          subTitle: "An order has been created",
          buttons: ['OK']
        });
        alert.present();
        let reset = {
          order: "",to: "",from: ""
        };
        this.notificationToAdmin.update2(reset);
      }
    });
  }

  private initializeAdminDevice(){
    this.initializeOnNotification();
    this.fcm.unsubscribeOfTopic("repartidores");
    this.fcm.subscribeToTopic("administradores");
  }

  private initializeDeliversDevice(){
    this.initializeOnNotification();
    this.fcm.unsubscribeOfTopic("administradores");
    this.fcm.subscribeToTopic("repartidores");
  }

  private initializeOnNotification(){
    this.fcm.getToken();
    // Listen to incoming messages
    this.fcm.listenToNotifications().pipe(
      tap(msg => {
        // show a toast
        const toast = this.toastCtrl.create({
          message: msg.body,
          duration: 3000
        });
        toast.present();
      })
    )
      .subscribe()
  }

  public start(){
    console.log("Es web? :"+!this.esMovil())
    if(this.sub == undefined) {
      // Does nothing
    } else {
      this.sub.unsubscribe();
    }

    if(!this.esMovil()&& this.esAdmin()) {
      this.initializeAdminWeb();
    } else if(this.esMovil()&& this.esAdmin()) {
      this.initializeAdminDevice();
    } else if(!this.esMovil()&& !this.esAdmin()) {
       this.initializeDelivererWeb()
    } else {
      this.initializeDeliversDevice();
    }

 }

}
