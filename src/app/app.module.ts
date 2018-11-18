import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { Geolocation } from '@ionic-native/geolocation';

import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { firebaseConfig } from './credentials';
import { FirebaseService } from "./services/firebase-service";
import { FirebaseServiceClients } from "./services/firebase-clients";
import {userToken} from "./services/userToken";
import {AngularFireAuthModule} from "angularfire2/auth";
import {LoginPage} from "../pages/login/login";
import {FirebaseServiceUsers} from "./services/firebase-users";
import {NewArticlePage} from "../pages/new-article/new-article";
import {FirebaseServiceArticles} from "./services/firebase-articles";
import {FirebaseServiceCategories} from "./services/firebase-categories";

@NgModule({
  declarations: [
    MyApp,
    HomePage


  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage


  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    Geolocation,
    FirebaseService,
    FirebaseServiceClients,
    userToken,
    FirebaseServiceUsers,
    FirebaseServiceArticles,
    FirebaseServiceCategories
  ]
})
export class AppModule {}
