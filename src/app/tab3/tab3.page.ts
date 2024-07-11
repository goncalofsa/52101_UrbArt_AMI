import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';
import { Post } from '../post.service';
import { PostdetailComponent } from '../postdetail/postdetail.component';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  favorites$: Observable<Post[]> | undefined;
  currentUser: any;

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private modalController: ModalController,
  ) { }

  ngOnInit() {
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.currentUser = user;
        this.loadFavorites();
      }
    });
  }

  loadFavorites() {
    this.favorites$ = this.afs.collection<Post>(`users/${this.currentUser.uid}/favorites`).valueChanges();
  }

  async reopenFavorites(post: Post) {
    const modal = await this.modalController.create({
      component: PostdetailComponent,
      componentProps: { post: post }
    });
    return await modal.present();
  }    
}
