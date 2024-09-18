import { ProjectService } from './../../../../services/project.service';
import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../../services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../../services/users.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-add-edit-project',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './add-edit-project.component.html',
  styleUrl: './add-edit-project.component.css'
})
export class AddEditProjectComponent {
  projectForm!: FormGroup;
  projectId: any = null;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private projectService = inject(ProjectService)
  clients : any[] = [];
  private clientService = inject(ClientsService);
  employees:any = null;
  private userService = inject(UsersService)

  compareFn( optionOne : any, optionTwo :any ) : boolean {
    return optionOne?.id === optionTwo?.id;
  }


  constructor(private toastr: ToastrService){
    this.projectForm = new FormGroup({
      client : new FormControl('', Validators.required),
      title : new FormControl(null, Validators.required),
      description : new FormControl(''),
      amount : new FormControl(null),
      hourly_rate : new FormControl(null),
      estimated_hours : new FormControl(null),
      actual_hours : new FormControl(null),
      assigned_person : new FormControl(''),
      sheet_url : new FormControl(''),
      created_at : new FormControl(null)
    })


    this.projectId = this.route.snapshot.paramMap.get('id');
    if(this.projectId){
      this.loadProject(this.projectId)
    }
    this.clientService.getAllClients().subscribe((res:any)=>{
      this.clients = res;
      console.log(this.clients)
    })

    this.userService.getAllUsers().subscribe((res:any)=>{
      this.employees = res;
    })
  }


  loadProject(projectId: string){
    this.projectService.getSingleProject(projectId).subscribe((project:any)=>{
      console.log(project)
      if(project){
        this.projectForm.patchValue(project);
      }
    })
  }



  onSubmit(){
    let project ={
      client : this.projectForm.value.client,
      title: this.projectForm.value.title,
      description : this.projectForm.value.description,
      amount : this.projectForm.value.amount,
      hourly_rate : this.projectForm.value.hourly_rate,
      estimated_hours : this.projectForm.value.estimated_hours,
      actual_hours : this.projectForm.value.actual_hours,
      assigned_person : this.projectForm.value.assigned_person,
      sheet_url : this.projectForm.value.sheet_url,
      created_at : new Date()
    }
    if(this.projectId){
      if(this.projectForm.valid){
        this.projectService.updateProject(project, this.projectId).then(()=>{
          this.toastr.success("Project Updated!!");
          this.projectForm.reset();
          this.router.navigate(['admin/project/list'])
        }).catch((error)=>{
          this.toastr.error("Error occured while Updating.")
        });
      }else{
        this.projectForm.markAllAsTouched();  // Mark all controls as touched to trigger validation messages
        return;
      }
    }else{
      if(this.projectForm.valid){
        this.projectService.addProject(project).then(()=>{
          this.toastr.success("Project Added!!");
          this.projectForm.reset();
          this.router.navigate(['admin/project/list'])
        }).catch((error)=>{
          this.toastr.error("Error occured while Adding.")
        });
      }else{
        this.projectForm.markAllAsTouched();  // Mark all controls as touched to trigger validation messages
        return;
      }
    }
  }
}
