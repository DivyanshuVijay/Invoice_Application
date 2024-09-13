import { Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  signinForm:any=this.fb.group({
    email:[null,[Validators.required]],
    password:[null,[Validators.required]]
  })

  constructor(public router:Router,public fb:FormBuilder, private auth : AuthService, private toastr: ToastrService){}

  login(){
    this.auth.login(this.signinForm.value.email, this.signinForm.value.password).then(()=>{
      this.router.navigate(['admin/invoice/list']);
      this.toastr.success("Successfully Logged in!!");
    }).catch((error)=>{
      this.toastr.error("Error occured while Logging in.")
    });
  }
}
