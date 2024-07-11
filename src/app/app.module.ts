import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { AngularFireDatabaseModule } from '@angular/fire/compat/database';
import { AngularFireAuthModule, SETTINGS } from '@angular/fire/compat/auth';
import { AngularFireStorageModule } from '@angular/fire/compat/storage';
import { ReactiveFormsModule } from '@angular/forms';
import { Tab2Page } from './tab2/tab2.page';
import { Tab2PageModule } from './tab2/tab2.module';
import { Tab2PageRoutingModule } from './tab2/tab2-routing.module';
import { PostdetailComponent } from './postdetail/postdetail.component';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAp5gsJ0JwIGYYYgxTFfXJg4udFANXKNg0",
  authDomain: "urbart-826b7.firebaseapp.com",
  projectId: "urbart-826b7",
  storageBucket: "urbart-826b7.appspot.com",
  messagingSenderId: "456563804122",
  appId: "1:456563804122:web:283c60609b6193a215a2e3",
  measurementId: "G-YCD5Y6BY0C"
};

@NgModule({
  declarations: [AppComponent, PostdetailComponent],
 
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    ReactiveFormsModule,
  ],
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    { provide: SETTINGS, useValue: {} }
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
