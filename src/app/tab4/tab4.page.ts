import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FireauthService } from '../fireauthservice.service';
import { ProfileService, UserProfile } from '../profile.service';
import { Observable, of, Subscription } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/compat';

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
})
export class Tab4Page implements OnInit {
  userProfile$!: Observable<UserProfile | null>;
  userId: string | null = null;
  authSubscription: Subscription | undefined;
  postForm: FormGroup | undefined;
  storage: any;

  constructor(
    private authService: FireauthService,
    private router: Router,
    private profileService: ProfileService,
    private afAuth: AngularFireAuth,
    private fb: FormBuilder
  ) {
    this.postForm = this.fb.group({
      photoUrl: ['', Validators.required],
      name: ['', Validators.required],
      origin: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userId = user.uid;

        this.userProfile$ = this.profileService.getUserProfile(this.userId);
        this.userProfile$.subscribe(profile => {
        });
      }
    });
  }

  logout() {
    this.authService.doLogout()
      .then((res: any) => {
        if (this.postForm) {
          this.postForm.reset();
          this.afAuth.signOut();
        }
        this.afAuth.signOut();
        this.userId = null;
        this.router.navigate(['/login']);
        setTimeout(() => {
          window.location.reload();
        }, 100);
      })
      .catch((err: any) => {
        console.error(err);
      });
  }
  
  ngOnDestroy() {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
