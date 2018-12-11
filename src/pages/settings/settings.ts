import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from "@ionic/storage";

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {

  articleSettings: any;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storage: Storage, public toastCtrl: ToastController) {
    this.storage.get("TypeView").then((data) =>{
      this.articleSettings = data;
    });
  }

  onSaveSettings(){
    this.storage.set('TypeView', this.articleSettings);
    let toast = this.toastCtrl.create({
      message: 'Settings saved',
      duration: 3000,
      position: 'bottom'
    });
    toast.present().then(() => this.navCtrl.pop());
  }
  navToUsers(){
    this.navCtrl.push("UserListPage");
  }
  navToChangePsw(){
    this.navCtrl.push("ChangePasswordPage");
  }
}
