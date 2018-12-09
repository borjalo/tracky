import { Component } from '@angular/core';
import {AlertController, IonicPage, ModalController, NavController, NavParams} from 'ionic-angular';
import { FirebaseServiceClients } from '../../app/services/firebase-clients';
import {Subscription} from 'rxjs';
import {ModalClientPage} from '../modal-client/modal-client';

@IonicPage()
@Component({
  selector: 'page-client-list',
  templateUrl: 'client-list.html',
})
export class ClientListPage {

  private clients: any;
  private sub: Subscription;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private firebaseClient: FirebaseServiceClients,
              private alertCtrl: AlertController,
              private modalCtrl: ModalController) {

    this.sub = this.firebaseClient.getClients().subscribe(res => {
      this.clients = res;
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  editClient(id) {
    this.navCtrl.push(ModalClientPage, {
      id: id,
    });
  }

  deleteClient(id) {
    let deleteClientAlert = this.alertCtrl.create({
      buttons: [
        {
          text: "No",
          role: 'cancel'
        },
        {
          text: "Yes",
          handler: () => {
            this.firebaseClient.removeClient(id);
          }
        }
      ],
      enableBackdropDismiss: false,
      message: "Are you sure you want to delete this client?",
    });
    deleteClientAlert.present();
  }

  createClient() {
    this.navCtrl.push(ModalClientPage);
  }
}
