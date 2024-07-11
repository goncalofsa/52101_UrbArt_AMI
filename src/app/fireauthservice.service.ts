import * as firebase from 'firebase/app';
import { FireserviceService } from './fireservice.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class FireauthService {
  $unauth() {
    throw new Error('Method not implemented.');
  }
  constructor(
    private firebaseService: FireserviceService,
    public afAuth: AngularFireAuth
  ){}
  
  doRegister(value: any) {
   return new Promise<any>((resolve, reject) => {
     this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err)
      )
    })
  }

  doLogin(value: any) {
   return new Promise<any>((resolve, reject) => {
     this.afAuth.signInWithEmailAndPassword(value.email, value.password)
     .then(
       res => resolve(res),
       err => reject(err))
    })
  }

  doLogout(){
    return new Promise<void>((resolve, reject) => {
      this.afAuth.signOut()
      .then(() => {
        this.firebaseService.unsubscribeOnLogOut();
        resolve();
      })
      .catch((error: any) => {
        console.log(error);
        reject();
      });
    })
  }
}
