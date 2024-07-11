import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { FireauthService } from '../fireauthservice.service';
import { Router } from '@angular/router';
import { ProfileService, UserProfile } from '../profile.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  validations_form: FormGroup;
  errorMessage: string = '';
  successMessage: string = '';
  selectedFile: File | null = null;
  validation_messages = {
    'name': [
      { type: 'required', message: 'Name is required.' },
    ],
    'origin': [
      { type: 'required', message: 'Origin is required.' },
    ],
    'email': [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Enter a valid email.' }
    ],
    'password': [
      { type: 'required', message: 'Password is required.' },
      { type: 'minlength', message: 'Password must be at least 5 characters long.' }
    ]
  };

  constructor(
    private authService: FireauthService,
    private formBuilder: FormBuilder,
    private profileService: ProfileService,
    private router: Router,
    private storage: AngularFireStorage
  ) {
    this.validations_form = this.formBuilder.group({
      name: ['', Validators.required],
      origin: ['', Validators.required],
      photoUrl: [''],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit() {
    this.validations_form = this.formBuilder.group({
      name: new FormControl('', Validators.required),
      origin: new FormControl('', Validators.required),
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.minLength(5),
        Validators.required
      ])),
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  async tryRegister(value: any) {
    if (this.selectedFile) {
      const filePath = `users/${new Date().getTime()}_${this.selectedFile.name}`;
      const fileRef = this.storage.ref(filePath);
      const task = this.storage.upload(filePath, this.selectedFile);

      task.snapshotChanges().pipe(
        finalize(async () => {
          const downloadURL = await fileRef.getDownloadURL().toPromise();
          this.registerUser(value, downloadURL);
        })
      ).subscribe();
    } else {
      this.registerUser(value, null);
    }
  }

  async registerUser(value: any, photoUrl: string | null) {
    this.authService.doRegister(value)
      .then(async res => {
        console.log(res);
        this.errorMessage = "";
        this.successMessage = "Your account has been created. Please login.";
        
        if (this.validations_form.valid) {
          const userProfile: UserProfile = {
            ...this.validations_form.value,
            photoUrl: photoUrl
          };
          try {
            await this.profileService.addUserProfile(userProfile);
            console.log("Profile added successfully");
            this.router.navigate(['/login']);
          } catch (error) {
            console.error("Error adding profile: ", error);
          }
        }
      }, err => {
        console.log(err);
        this.errorMessage = err.message;
        this.successMessage = "";
      });
  }

  goLoginPage() {
    this.router.navigate(["/login"]);
  }
}
