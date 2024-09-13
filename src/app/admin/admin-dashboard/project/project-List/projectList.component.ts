import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectService } from '../../../../services/project.service';
import { ConfirmPopupComponent } from '../../../../components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ClientsService } from '../../../../services/clients.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-projectList',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './projectList.component.html',
  styleUrl: './projectList.component.css'
})
export class ProjectListComponent {
  projectList: any[] = [];
  filteredProjects: any[] = [];
  clients: any[] = [];
  private projectService = inject(ProjectService);
  private clientService = inject(ClientsService);
  private router = inject(Router);
  private dialogOpen: boolean = false; // Flag to check if dialog is open

  projectFilterForm = new FormGroup({
    selectedClient: new FormControl('') // Default to an empty string
  });

  constructor(public dialog: MatDialog) {
    this.projectService.getAllProjects().subscribe((res: any) => {
      this.projectList = res;
      this.filteredProjects = res;
    });

    this.clientService.getAllClients().subscribe((res: any) => {
      this.clients = res;
    });
  }

  navigateToSingleProject(id: any) {
    this.router.navigate([`admin/project/project-detail/${id}`]);
  }

  addProject() {
    this.router.navigate([`admin/project/add`]);
  }
  navigateToUpdate(id: any) {
    this.router.navigate([`admin/project/edit/${id}`]);
  }

  navigateToDelete(id: any) {
    if (this.dialogOpen) return;
    this.dialogOpen = true;

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: { title: 'Delete Confirm', message: 'Are you sure you want to delete this project?' },
    });

    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false;
      if (result === 'yes') {
        this.projectService.deleteProject(id);
      }
    });
  }

  navigateToSheet(url : any){
    window.open(url, '_blank'); // Opens the link in a new tab
  }

  applyFilters() {
    const selectedClient = this.projectFilterForm.value.selectedClient;
    console.log('Selected Client:', selectedClient);

    this.filteredProjects = this.projectList.filter(project => {
      return selectedClient ? project.client.name === selectedClient : true;
    });
  }
}
