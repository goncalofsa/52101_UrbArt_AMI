import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Post, PostService } from '../post.service';
import { UserProfile, ProfileService } from '../profile.service';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-postdetail',
  templateUrl: './postdetail.component.html',
  styleUrls: ['./postdetail.component.scss'],
})
export class PostdetailComponent implements OnInit {

  @Input() post: Post | undefined;
  isFavorite: boolean = false;
  currentUser: any;
  userProfile: UserProfile | null = null;
  posts: Post[] = [];
  currentPhotoIndex: number = 0; // Current photo index

  constructor(
    private modalController: ModalController,
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private profileService: ProfileService,
    private postService: PostService,
  ) { }

  getDocumentField(documentPath: string, fieldName: string): Observable<string> {
    return this.afs.doc<any>(documentPath).valueChanges().pipe(
      map(doc => doc[fieldName])
    );
  }
  
  ngOnInit(): void {
    this.afAuth.authState.subscribe(user => {
      this.currentUser = user;

      if (this.post && this.post.userId) {
        this.checkIfFavorite();
      }

      // Fetch posts with user profiles
      this.postService.getPostsWithUserProfiles().subscribe((posts: Post[]) => {
        this.posts = posts;
      });
    });
  }  

  dismiss() {
    this.modalController.dismiss();
  }

  checkIfFavorite() {
    if (!this.currentUser || !this.post) {
      return;
    }
    const userFavoritesRef = this.afs.collection(`users/${this.currentUser.uid}/favorites`).doc(this.post.title);
    userFavoritesRef.get().subscribe(docSnapshot => {
      this.isFavorite = docSnapshot.exists;
    });
  }

  toggleFavorite() {  
    if (!this.currentUser || !this.post) {
      return;
    }

    const userFavoritesRef = this.afs.collection(`users/${this.currentUser.uid}/favorites`).doc(this.post.title);

    if (this.isFavorite) {
      userFavoritesRef.delete().then(() => {
        this.isFavorite = false;
      }).catch(error => {
        console.error('Error removing favorite:', error);
      });
    } else {
      userFavoritesRef.set(this.post).then(() => {
        this.isFavorite = true;
      }).catch(error => {
        console.error('Error adding favorite:', error);
      });
    }
  }

  deletePost() {
    if (!this.post || !this.post.id) {
      console.error('Post ID is missing');
      return;
    }

    this.postService.deletePost(this.post.id).subscribe({
      next: () => {
        console.log('Post deleted successfully');
        this.dismiss();
      },
      error: (error) => {
        console.error('Error deleting post:', error);
      }
    });
  }

  previousPhoto() {
    if (this.currentPhotoIndex > 0) {
      this.currentPhotoIndex--;
    }
  }

  nextPhoto() {
    if (this.post && this.currentPhotoIndex < this.post.photoUrls.length - 1) {
      this.currentPhotoIndex++;
    }
  }
}
