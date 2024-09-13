import { Component, inject } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { Router } from '@angular/router';
import { CommentsService } from '../../../../services/comments.service';

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent {
  employees: any[] = [];
  employeeId : any = null;
  private userService = inject(UsersService);
  private commentService = inject(CommentsService)
  private router = inject(Router);

  constructor(){
    this.userService.getAllUsers().subscribe((res:any)=>{
      this.employees = res;
    })
  }


  navigateToView(id : any){
    this.router.navigate([`admin/employee/employee-detail/${id}`])
  }
  
  navigateToUpdate(id : any){
    this.router.navigate([`admin/employee/edit/${id}`])
  }
  navigateToTimesheet(link :any){
    window.open(link, '_blank'); // Opens the link in a new tab
  }
}
