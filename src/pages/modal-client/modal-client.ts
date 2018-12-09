import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ViewController} from 'ionic-angular';
import {Client, FirebaseServiceClients} from '../../app/services/firebase-clients';

@IonicPage()
@Component({
  selector: 'page-modal-client',
  templateUrl: 'modal-client.html',
})
export class ModalClientPage {
  client: Client = {
    name: "",
    phone: null,
    email: "",
    street: "",
    city: "",
    info: "",
  };

  newClient: any;
  clientID: any;
  clientToEdit: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public firebaseClient: FirebaseServiceClients,
              private loadingCtrl: LoadingController) {

    this.newClient = this.navParams.get("newClient");
    this.clientID = this.navParams.get("id");

    if(this.clientID != undefined) {
      this.firebaseClient.getClient(this.clientID).subscribe(res => {
        this.clientToEdit = res;
        this.client.name = res.name;
        this.client.phone = res.phone;
        this.client.email = res.email;
        this.client.street = res.street;
        this.client.city = res.city;
        this.client.info = res.info;
      });
    }
  }

  createClient(client) {
    let loadingCreating = this.loadingCtrl.create({
      content: 'Creating client...'
    });
    loadingCreating.present().then(() => {
      this.firebaseClient.addClient(client).then(() => {
        this.navCtrl.pop().then(() => {
          loadingCreating.dismiss();
        });
      });
    })
  }

  updateClient(client) {
    let loadingUpdating = this.loadingCtrl.create({
      content: 'Updating client...'
    });
    loadingUpdating.present().then(() => {
      this.firebaseClient.updateClient(client, this.clientID).then(() => {
        this.navCtrl.pop().then(() => {
          loadingUpdating.dismiss();
        });
      });
    });
  }

}
