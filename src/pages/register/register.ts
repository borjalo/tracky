import { Component } from '@angular/core';
import { AlertController, IonicPage, NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFireAuth } from "angularfire2/auth";
import { userToken } from "../../app/services/userToken";
import { FirebaseServiceUsers, User } from '../../app/services/firebase-users';
import { UserListPage } from "../user-list/user-list";

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})

export class RegisterPage {

  private email: string = "";
  private password: string = "";
  private confirmPassword: string = "";
  private type: string;
  private username: string = "";
  user: User = {
    email : this.email,
    password : this.password,
    tipo : this.type,
    nombre: this.username,
  };

  constructor(
              private alerController: AlertController,
              private afAuth: AngularFireAuth,
              private loadingController: LoadingController,
              public navCtrl: NavController,
              public navParams: NavParams,
              private usersToken: userToken,
              private firebaseService: FirebaseServiceUsers,
              public toastCtrl: ToastController,
  ) {

  }

  createAcount(){
    if(this.email == "" || this.email.indexOf("@") == -1){
      this.alerController.create({
        title: "Error",
        subTitle: "Email void or incorrect",
        buttons:['OK'],
      }).present();
    }else if (this.password == this.confirmPassword){
      this.afAuth.auth.createUserWithEmailAndPassword(this.email, this.password).then(() => {

        this.user.nombre = this.username;
        this.user.tipo = this.type;
        this.user.password = this.password;
        this.user.email = this.email;

        this.firebaseService.addUser(this.user).then(() => {
          this.toastCtrl.create({
            message: 'User has been created',
            duration: 3000,
            position: 'bottom'
          }).present().then( () => this.navCtrl.setRoot("UserListPage"));

        });
      });
    }else if(this.password == this.confirmPassword){
      this.alerController.create({
        title: "Error",
        subTitle: "Passwords do not match",
        buttons:['OK'],
      }).present();
    }
  }

}
