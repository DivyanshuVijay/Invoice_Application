import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SuperAdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: any, state: any): boolean | Promise<boolean> | Observable<boolean> {
    const user = this.authService.getCurrentUser();
    if (user && user.uid === 'PdCuei9vGvMGGpAp7D2xdxeD2rk2') {
      return true; // Superadmin can access all pages
    } else {
      this.router.navigate(['/admin/todos/list']); // Redirect to Todo list page
      return false;
    }
  }
}