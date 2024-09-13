import { UsersService } from './../../../../services/users.service';
import { NgClass } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { TodoService } from '../../../../services/todo.service';
import { Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { TodoAddComponent } from '../todo-add/todo-add.component';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../../../../services/auth.service';


@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [NgClass, ReactiveFormsModule, MatSelectModule, MatOptionModule],
  templateUrl: './todo-list.component.html',
  styleUrl: './todo-list.component.css'
})
export class TodoListComponent implements OnInit {
  todos: any[] = [];
  groupedTodos: { [key: string]: any[] } = {}; 
  employees: any[] = [];
  private router = inject(Router);
  private dialog = inject(MatDialog);
  userId: any = null;
  superAdminId: string = 'PdCuei9vGvMGGpAp7D2xdxeD2rk2';
  isSuperAdmin : boolean = false;
  userSpecificTasks: any[] = []; // Array to store tasks assigned to the specific user


  constructor(
    private todoService: TodoService,
    private userService: UsersService,
    private authService : AuthService
  ) {
    this.userId = this.authService.getCurrentUser()?.uid;

    if(this.userId && (this.userId === this.superAdminId)){
      this.isSuperAdmin = true;
    }
  }

  statusFilter = new FormGroup({
    selectedStatus : new FormControl<string[]>([], Validators.required)
  })


  ngOnInit(): void {
    this.loadEmployees();
    this.loadTodos();
  }

  loadEmployees(): void {
    this.userService.getAllUsers().subscribe(data => {
      this.employees = data;
      // Initialize the groupedTodos object with empty arrays for each employee
      this.employees.forEach(employee => {
        this.groupedTodos[employee.name] = [];
      });
    });
  }


  loadTodos(): void {
    this.todoService.getAllTodos().subscribe(data => {
      this.todos = data;
      this.groupTodosByEmployee();
    });
  }


  groupTodosByEmployee(){
    const selectedStatuses = this.statusFilter.value.selectedStatus;
  
    const filteredTodos = this.todos.filter(todo =>
      selectedStatuses!.length === 0 
      ? todo.status !== 'Completed' 
      : selectedStatuses!.includes(todo.status)
    );
  
    if (this.isSuperAdmin) {
      // If the user is a super admin, show all tasks
      this.employees.forEach(employee => {
        this.groupedTodos[employee.name] = filteredTodos.filter(todo => todo.assignedTo === employee.id);
      });
    }else{
      this.userSpecificTasks = filteredTodos.filter(todo => todo.assignedTo === this.userId);
    }
  }
  

  filterTodosByStatus() {
    this.groupTodosByEmployee(); 
  }


  openTodoDialog(todoId?: any): void {
    const dialogRef = this.dialog.open(TodoAddComponent, {
      width: '700px',
      data:  todoId
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTodos(); 
      }
    });
  }

  navigateToAdd() {
    this.openTodoDialog();
  }

  navigateToEdit(id: any) {
    this.openTodoDialog(id);
  }
}
