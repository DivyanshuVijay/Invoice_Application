import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsersService } from '../../../../services/users.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-employee-edit',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './employee-edit.component.html',
  styleUrl: './employee-edit.component.css'
})
export class EmployeeEditComponent {
  employeeForm: FormGroup;
  private router = inject(Router);
  employeeId : any = null;
  private route = inject(ActivatedRoute);
  private userService = inject(UsersService);

  constructor(private toastr: ToastrService,private fb: FormBuilder){
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if(this.employeeId){
      this.loadCompany(this.employeeId)
    }

    this.employeeForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      joining_date: ['', Validators.required],
      timesheet: ['', Validators.required],
      type: ['', Validators.required]
    });
  }


  loadCompany(employeeId: string){
    this.userService.getSingleUser(employeeId).subscribe((employee:any)=>{
      console.log(employee)
      if(employee){
        this.employeeForm.patchValue(employee);
      }
    })
  }

  onSubmit(id:any){
    if(this.employeeForm.valid){
      let employee = this.employeeForm.value;
      
      this.userService.updateUser(employee , id).then(()=>{
        this.toastr.success("Employee Info Updated !!");
        this.router.navigate(['/admin/employee/list']);
      }).catch(()=>{
        this.toastr.error("Error Occured while updating.")
      });
    }else{
      this.employeeForm.markAllAsTouched();  // Mark all controls as touched to trigger validation messages
      return;
    }
  }
}
