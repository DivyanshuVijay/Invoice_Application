import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientsService } from '../../../../services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../../../services/common.service';
import { UsersService } from '../../../../services/users.service';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-add-edit-client',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './add-edit-client.component.html',
  styleUrl: './add-edit-client.component.css'
})
export class AddEditClientComponent {
  clientId: any = null;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private clientService = inject(ClientsService)
  private commonService = inject(CommonService)
  employees:any = null;
  private userService = inject(UsersService)
  
  categories : any = null;
  sources : any = null;
  statuses :any = null;

  constructor(private toastr: ToastrService){
    this.clientId = this.route.snapshot.paramMap.get('id');
    if(this.clientId){
      this.loadClient(this.clientId)
    }
    this.commonService.getAllProjectCategory().subscribe((res:any)=>{
      this.categories = res;
    })
    this.commonService.getAllSources().subscribe((res:any)=>{
      this.sources = res;
    })
    this.commonService.getAllStatus().subscribe((res:any)=>{
      this.statuses = res;
    })

    this.userService.getAllUsers().subscribe((res:any)=>{
      this.employees = res;
    })
  }


  loadClient(clientId: string){
    this.clientService.getSingleClient(clientId).subscribe((client:any)=>{
      console.log(client)
      if(client){
        this.clientForm.patchValue(client);
      }
    })
  }

  clientForm = new FormGroup({
    name : new FormControl('', Validators.required),
    email : new FormControl('', Validators.required),
    phone : new FormControl('', Validators.required),
    project_category : new FormControl('', Validators.required),
    source : new FormControl('', Validators.required),
    status : new FormControl('', Validators.required),
    address : new FormControl('', Validators.required),
    contact_person : new FormControl('', Validators.required),
    quoted_rate : new FormControl('', Validators.required),
  })

  onSubmit(){
    let client ={
      name : this.clientForm.value.name,
      email: this.clientForm.value.email,
      phone : this.clientForm.value.phone,
      project_category : this.clientForm.value.project_category,
      source : this.clientForm.value.source,
      status : this.clientForm.value.status,
      address : this.clientForm.value.address,
      contact_person : this.clientForm.value.contact_person,
      quoted_rate : this.clientForm.value.quoted_rate as string,
      createdOn : new Date(),
      updatedOn: new Date(),
    }
    if(this.clientId){
      if(this.clientForm.valid){
        client.updatedOn = new Date();
        this.clientService.updateClient(client, this.clientId).then(()=>{
          this.toastr.success("Client Updated!!");
          this.router.navigate(['admin/client/list'])
          this.clientForm.reset();
        }).catch((error)=>{
          this.toastr.error("Error occured while updating.")
        });
      }else{
        alert("Please fill the form.")
      }
    }else{
      if(this.clientForm.valid){
        client.createdOn = new Date();

        this.clientService.addClient(client).then(()=>{
          this.toastr.success("Client Added!!");
          this.router.navigate(['admin/client/list'])
          this.clientForm.reset();
        }).catch((error)=>{
          this.toastr.error("Error occured while updating.")
        });
      }else{
        this.clientForm.markAllAsTouched();  // Mark all controls as touched to trigger validation messages
        return;
      }
    }
  }
}
