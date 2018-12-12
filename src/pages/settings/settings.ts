import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Storage } from "@ionic/storage";
import { Observable } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';
import * as firebase from 'firebase';

export interface CD {
  id?: string;
  companyname: any;
  phonenumber: any;
  email: any;
  address: any;
  description: any;
  website: any;
}

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html',
})
export class SettingsPage {
  companydata: CD = {
    companyname: "",
    phonenumber: "",
    email: "",
    address: "",
    description: "",
    website: "",
  };

  length: any;
  articleSettings: any;

  private companyData: AngularFirestoreCollection<CD>;

  private data: Observable<CD[]>;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public storage: Storage, public toastCtrl: ToastController,
              db: AngularFirestore) {
    this.storage.get("TypeView").then((data) =>{
      this.articleSettings = data;
    });

    this.companyData = db.collection<CD>('company-data');

    this.data = this.companyData.snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data();
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
     this.getCompanyData().subscribe((res) => {
       this.length = res.length;
       if (res.length >= 1) {
         this.companydata = res[0];
       }
     })
  }

  onSaveSettings(){
    this.storage.set('TypeView', this.articleSettings);
    this.saveCompanyData();
    let toast = this.toastCtrl.create({
      message: 'Settings saved',
      duration: 3000,
      position: 'bottom'
    });
    toast.present().then(() => this.navCtrl.pop());
  }

  saveCompanyData() {
    if (this.length == 0) {
      this.addCompanyData(this.companydata);
    } else if (this.length == 1) {
      this.updateCompanyData(this.companydata, this.companydata.id);
    }

  }

  getCompanyData() {
    return this.data;
  }

  updateCompanyData(cd: CD, id: string) {
    return this.companyData.doc(id).update(cd);
  }

  addCompanyData(cd: CD) {
    return this.companyData.add(cd);
  }

  navToUsers(){
    this.navCtrl.push("UserListPage");
  }
  navToChangePsw(){
    this.navCtrl.push("ChangePasswordPage");
  }
}
