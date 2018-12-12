import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { User, FirebaseServiceUsers } from "../../app/services/firebase-users";
import { Subscription } from "rxjs";

@IonicPage()
@Component({
  selector: 'page-user-list',
  templateUrl: 'user-list.html',
})
export class UserListPage {

  private sub: Subscription;
  public users: any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public alertController: AlertController,
              public firebaseUsers: FirebaseServiceUsers,
              private toastController: ToastController) {

    this.sub = this.firebaseUsers.getUsers().subscribe(res => {
      this.users = res;
      console.log(this.users);
    });

  }

  ngOnDestroy(){
    this.sub.unsubscribe();
  }

  editUser(user: User){
    this.alertController.create({
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            if (user.tipo == 'admin') {
              user.tipo = 'deliveryman';
            } else {
              user.tipo = 'admin';
            }
            this.firebaseUsers.updateUser(user, user.id).then(() => {
              this.toastController.create({
                message: 'The type has been created',
                duration: 3000,
                position: 'bottom'
              }).present();
            });
          }
        }
      ],
      enableBackdropDismiss: false,
      message: "Are you sure to change the type of user?",
    }).present();
  }

  deleteUser(id){
    this.alertController.create({
      buttons: [
        {
          text: 'No',
          role: 'cancel'
        },
        {
          text: 'Yes',
          handler: () => {
            this.firebaseUsers.removeUser(id).then(() => {
              this.toastController.create({
                message: 'The user has been removed',
                duration: 3000,
                position: 'bottom'
              }).present();
            });
          }
        },
      ],
      enableBackdropDismiss: false,
      message: "Are you sure you want to delete this user?",
    }).present();
  }

  createUser(){
    this.navCtrl.push('RegisterPage');
  }
}
