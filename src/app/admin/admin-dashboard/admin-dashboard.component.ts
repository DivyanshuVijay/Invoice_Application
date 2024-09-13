import { AuthService } from './../../services/auth.service';
import { ConfirmPopupComponent } from './../../components/confirm-popup/confirm-popup.component';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { PrintInvoiceComponent } from "../../components/print-invoice/print-invoice.component";


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [RouterOutlet, RouterLink, NgClass, PrintInvoiceComponent, RouterLinkActive],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {
  desktopSidebarActive: boolean = true;
  private authService = inject(AuthService);
  private dialogOpen: boolean = false; // Flag to check if dialog is open
  userId: any = null;
  superAdminId: string = 'PdCuei9vGvMGGpAp7D2xdxeD2rk2';
  isSuperAdmin : boolean = false;


  constructor(public dialog:MatDialog){
    this.userId = this.authService.getCurrentUser()?.uid;

    if(this.userId && (this.userId === this.superAdminId)){
      this.isSuperAdmin = true;
    }
  }

  toggle(){
    this.desktopSidebarActive = !this.desktopSidebarActive
  }

  logout(){
    if (this.dialogOpen) return; // Prevent opening multiple dialogs
    this.dialogOpen = true;


    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {title: 'Logout Confirm', message: 'Are you sure you want to logout?'},
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false; // Reset flag when dialog closes
      if(result == 'yes'){
     this.authService.logout()
      }
    });
  }
}
