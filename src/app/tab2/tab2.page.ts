import { Component, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PostService, Post } from '../post.service';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { forkJoin, Observable, from } from 'rxjs';
import { switchMap, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  postForm: FormGroup;
  photos: File[] = [];

  constructor(
    private fb: FormBuilder,
    private postService: PostService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage
  ) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  onFilesSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.photos.push(files.item(i)!);
    }
    this.cdr.detectChanges();
  }

  async submitPost() {
    if (this.postForm.valid && this.photos.length > 0) {
      const post: Post = {
        userId: '',
        userName: '',
        userPhotoUrl: '',
        userOrigin: '',
        title: this.postForm.value.title,
        description: this.postForm.value.description,
        photoUrls: [],
        coordinates: {
          lat: 0,
          lng: 0
        },
        timestamp: new Date().toISOString()
      };

      navigator.geolocation.getCurrentPosition(
        position => {
          post.coordinates = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          this.afAuth.authState.subscribe(user => {
            if (user) {
              post.userId = user.uid;

              const uploadTasks: Observable<string>[] = this.photos.map(file => {
                const filePath = `posts/${new Date().getTime()}_${file.name}`;
                const fileRef = this.storage.ref(filePath);
                const task = this.storage.upload(filePath, file);

                return from(task.snapshotChanges().pipe(
                  finalize(() => {})
                ).toPromise().then(() => fileRef.getDownloadURL().toPromise())) as Observable<string>;
              });

              forkJoin(uploadTasks).subscribe(urls => {
                post.photoUrls = urls;

                this.postService.createPost(post).subscribe(() => {
                  this.resetForm();
                  this.router.navigate(['/tabs']);
                }, err => {
                  console.error('Error creating post:', err);
                });
              }, error => {
                console.error('Error uploading files:', error);
              });

            } else {
              console.error('No user logged in');
            }
          });
        },
        error => {
          console.error('Error getting location', error);
        }
      );
    }
  }

  getPhotoUrl(photo: File): string {
    return URL.createObjectURL(photo);
  }

  resetForm() {
    this.postForm.reset();
    this.photos = [];
    this.cdr.detectChanges();
  }
}
