import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Auth, User, authState } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

//this guard is to check whether the user is logged in or not , if not redirect to login page.
export class AuthGuard implements CanActivate {
  private auth = inject(Auth);
  private router = inject(Router);
  

  canActivate(): Observable<boolean> {
    return authState(this.auth).pipe(
      map((user: any) => {
        if (user) {
          return true; // User is authenticated
        } else {
          this.router.navigate(['auth/login']);
          return false; // User is not authenticated
        }
      })
    );
  }
}
