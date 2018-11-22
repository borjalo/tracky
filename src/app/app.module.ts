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
import { FirebaseServiceDeliveryMans } from './services/firebase-deliverymans';
import { AndroidPermissions } from '@ionic-native/android-permissions';
import { LocationAccuracy } from '@ionic-native/location-accuracy';

import { userToken} from "./services/userToken";
import { AngularFireAuthModule } from "angularfire2/auth";
import { FirebaseServiceUsers } from "./services/firebase-users";
import { FcmProvider } from "./services/fcm";
import { Firebase } from '@ionic-native/firebase';
import { NotificationToAdminCore } from "./services/notificationsToAdmin";
import { NotificationByPlatfrom } from "./services/notificationByPlatform";
import { HttpClientModule } from "@angular/common/http";
import { FirebaseServiceArticles } from "./services/firebase-articles";
import { FirebaseServiceCategories } from "./services/firebase-categories";
import { IonicStorageModule } from "@ionic/storage";
import { BackgroundGeolocation } from '@ionic-native/background-geolocation';
import { LocationTrackerProvider } from '../providers/location-tracker/location-tracker';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
  ],
  providers: [
    StatusBar,
    Firebase,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    BackgroundGeolocation,
    Geolocation,
    FirebaseService,
    FirebaseServiceDeliveryMans,
    FirebaseServiceClients,
    AndroidPermissions,
    LocationAccuracy,
    userToken,
    FirebaseServiceUsers,
    FcmProvider,
    NotificationToAdminCore,
    NotificationByPlatfrom,
    FirebaseServiceArticles,
    FirebaseServiceCategories,
    LocationTrackerProvider,

  ]
})
export class AppModule {}
