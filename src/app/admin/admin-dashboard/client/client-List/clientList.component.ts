import { ConfirmPopupComponent } from './../../../../components/confirm-popup/confirm-popup.component';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../../services/clients.service';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-clientList',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './clientList.component.html',
  styleUrl: './clientList.component.css'
})
export class ClientListComponent {
  clientList : any[] = [];
  private clientService = inject(ClientsService)
  private commonService = inject(CommonService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private dialogOpen: boolean = false; // Flag to check if dialog is open
  filteredClients: any = [];
  categories: any = [];

  clientFilterForm = new FormGroup({
    selectedProjectCategory: new FormControl('') // Default to an empty string
  });
  
  constructor(public dialog:MatDialog){
    this.clientService.getAllClients().subscribe((res: any) => {
      this.filteredClients = res;
      this.clientList = res;
    });

    this.commonService.getAllProjectCategory().subscribe((res:any)=>{
      this.categories = res;
    })
  }


  navigateToSingleClient(id:any){
    this.router.navigate([`admin/client/client-detail/${id}`])
  }

  navigateToUpdate(id:any){
    this.router.navigate([`admin/client/edit/${id}`])
  }

  navigateToDelete(id:any){
    if (this.dialogOpen) return; 
    this.dialogOpen = true;


    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {title: 'Delete Confirm', message: 'Are you sure you want to Delete Client?'},
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false; 
      if(result == 'yes'){
         this.clientService.deleteClient(id);
      }
    });

  }
  
  navigateToAddClient(){
    this.router.navigate([`admin/client/add`])
  }


  applyFilters() {
    const selectedCategory = this.clientFilterForm.value.selectedProjectCategory;

    this.filteredClients = this.clientList.filter(client => {
      return selectedCategory ? client.project_category === selectedCategory : true;
    });
  }
}
