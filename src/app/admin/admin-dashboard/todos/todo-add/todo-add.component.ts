import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UsersService } from '../../../../services/users.service';
import { TodoService } from '../../../../services/todo.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-todo-add',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './todo-add.component.html',
  styleUrl: './todo-add.component.css'
})
export class TodoAddComponent {
  todoForm: FormGroup;
  employees: any[] = []; 
  statusOptions = ['Open', 'InProgress', 'Review', 'Completed'];
  userId: any = null;
  superAdminId: string = 'PdCuei9vGvMGGpAp7D2xdxeD2rk2';
  isSuperAdmin : boolean = false;

  constructor(
    private fb: FormBuilder,
    private userService: UsersService,
    private todoService: TodoService ,
    private authService : AuthService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<TodoAddComponent>, // Handle dialog close actions
    @Inject(MAT_DIALOG_DATA) public todoId: any // Receive the todoId as dialog data
  ) {

    this.userId = this.authService.getCurrentUser()?.uid;

    if(this.userId && (this.userId === this.superAdminId)){
      this.isSuperAdmin = true;
    }


    this.todoForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      assignedTo: [{ value: '', disabled: !this.isSuperAdmin }, Validators.required],
      status: ['Open', Validators.required]
    });

    if (this.todoId) {
      this.loadTodo();
    }

    this.loadEmployees();
  }

  loadTodo() {
    this.todoService.getSingleTodo(this.todoId).subscribe((todo: any) => {
      if (todo) {
        this.todoForm.patchValue(todo);
      }      
    });
  }


  loadEmployees() {
    this.userService.getAllUsers().subscribe(data => {
      this.employees = data;
    });
  }


  onSubmit() {
    if (this.todoForm.valid) {
      if (this.todoId) {
        this.todoService.updateTodo(this.todoForm.value, this.todoId).then(() => {
          this.toastr.success("ToDo Updated!!");
          this.dialogRef.close(true); // Close the dialog and return success
        }).catch((error) => {
          this.toastr.error("Error occurred while updating.");
        });
      } else {
        let object = {
          ...this.todoForm.value, 
          assignedTo: this.userId
        }
        this.todoService.addTodo(object).then(() => {
          this.toastr.success("ToDo Added!!");
          this.dialogRef.close(true); // Close the dialog and return success
        }).catch((error) => {
          this.toastr.error("Error occurred while adding.");
        });
      }
    }
  }


  onCancel() {
    this.dialogRef.close(false); // Close the dialog without any changes
  }
}
