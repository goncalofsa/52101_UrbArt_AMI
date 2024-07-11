import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { combineLatest, from, map, Observable, switchMap } from 'rxjs';
import { ProfileService } from './profile.service';

export interface Post {
  id?: string;
  coordinates: { lat: number, lng: number };
  userId: string;
  userName: string;
  userPhotoUrl: string;
  userOrigin: string;
  title: string;
  description: string;
  photoUrls: string[];
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private profileService: ProfileService
  ) {}

  createPost(post: Post): Observable<void> {
    return new Observable<void>(observer => {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          this.profileService.getUserProfile(user.uid).pipe(
            switchMap(userProfile => {
              post.userName = userProfile?.name ?? '';
              post.userPhotoUrl = userProfile?.photoUrl ?? '';
              post.userOrigin = userProfile?.origin ?? '';

              return this.afs.collection('posts').add(post);
            })
          ).subscribe({
            next: () => {
              console.log('Post created successfully');
              observer.next();
              observer.complete();
            },
            error: (error) => {
              console.error('Error adding post:', error);
              observer.error(error);
            }
          });
        } else {
          observer.error('No user logged in');
        }
      });
    });
  }

  getPosts(): Observable<Post[]> {
    return this.afs.collection<Post>('posts', ref => ref.orderBy('timestamp', 'desc')).snapshotChanges().pipe(
      map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.id;
          return { id, ...data };
        });
      })
    );
  }

  getPostsWithUserProfiles(): Observable<Post[]> {
    return this.afs.collection<Post>('posts', ref => ref.orderBy('timestamp', 'desc')).valueChanges().pipe(
      switchMap(posts => {
        const userProfileObservables = posts.map(post =>
          this.profileService.getUserProfile(post.userId).pipe(
            map(userProfile => {
              return { 
                ...post, 
                userName: userProfile?.name ? userProfile.name : '', 
                userPhotoUrl: userProfile?.photoUrl || '', 
                userOrigin: userProfile?.origin || ''
              };
            })
          )
        );
        return combineLatest(userProfileObservables);
      })
    );
  }

  deletePost(postId: string): Observable<void> {
    return from(this.afs.collection('posts').doc(postId).delete());
  }
}
