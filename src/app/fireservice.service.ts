import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FireserviceService {
  
  private snapshotChangesSubscription: any;

  constructor(
    public af: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  unsubscribeOnLogOut() {
    if (this.snapshotChangesSubscription) {
      this.snapshotChangesSubscription.unsubscribe();
    }
  } 
}
