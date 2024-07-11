import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

export interface UserProfile {
  name: string;
  origin: string;
  photoUrl: string;
  email: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth
  ) { }

  getUserProfile(userId: string): Observable<UserProfile | null> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<UserProfile>(`users/${user.uid}`).valueChanges().pipe(
            map(profile => profile ?? null)
          );
        } else {
          console.log('No user logged in');
          return of(null);
        }
      })
    );
  }

  addUserProfile(userProfile: UserProfile): Promise<void> {
    return this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc(`users/${user.uid}`).set(userProfile);
        } else {
          return Promise.reject('No user logged in');
        }
      })
    ).toPromise();
  }
}
