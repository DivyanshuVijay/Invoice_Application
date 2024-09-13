import { inject, Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor() { }


  private fireAuth = inject(Auth);
  private router = inject(Router);
  
  // tokenUid: string = '';

  //login
  async login(email: string, password: string) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        this.fireAuth,
        email,
        password
      );
    } catch (error: any) {
      this.handleFirebaseError(error);
    }
  }

    //logout signout
    logout() {
      try {
          signOut(this.fireAuth).then(()=>{
          console.log('Log Out Successful');
          this.router.navigate(['auth/login']); // Navigate to login page after logout
        });
      } catch (error) {
        console.log('Error while logging out.', error);
      }
    }

  // Get current user
  getCurrentUser() {
    return this.fireAuth.currentUser;
  }

  handleFirebaseError(error: any) {
    if (error.code == 'auth/email-already-in-use') {
      alert(
        'This email address is already in use. Please use a different email.'
      );
    } else if (error.code == 'auth/invalid-email') {
      alert('The email address is not valid. Please enter a valid email.');
    } else if (error.code == 'auth/invalid-credential') {
      alert('Invalid Credentials. Please enter valid credentials.');
    } else if (error.code == 'auth/too-many-requests') {
      alert(
        'Account has been temporarily disabled due to many failed login attempts.'
      );
    } else {
      alert('An unknown error occurred. Please try again.');
    }
  }
}
