import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from '../../../../components/confirm-popup/confirm-popup.component';

@Component({
  selector: 'app-companyList',
  standalone: true,
  imports: [],
  templateUrl: './companyList.component.html',
  styleUrl: './companyList.component.css'
})
export class CompanyListComponent {
  companyList : any[] = [];
  private companyService = inject(CompanyService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialogOpen: boolean = false; // Flag to check if dialog is open


  constructor(public dialog:MatDialog){
    this.companyService.getAllCompany().subscribe((res: any) => {
      this.companyList = res;
      console.log(res)
    });
  }


  navigateToSingleCompany(id:any){
    this.router.navigate([`admin/company/company-detail/${id}`])
  }

  navigateToUpdate(id:any){
    this.router.navigate([`admin/company/edit/${id}`])
  }

  navigateToDelete(id:any, logopath: any){
    if (this.dialogOpen) return; 
    this.dialogOpen = true;

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {title: 'Delete Confirm', message: 'Are you sure you want to Delete Company?'},
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false; 
      if(result == 'yes'){
         this.companyService.deleteCompany(id, logopath)
      }
    });
  }
  
  navigateToAddCompany(){
    this.router.navigate([`admin/company/add`])
  }
}
