import { Routes } from '@angular/router';
import { AdminAuthComponent } from './admin/admin-auth/admin-auth.component';
import { LoginComponent } from './admin/admin-auth/login/login.component';
import { AdminDashboardComponent } from './admin/admin-dashboard/admin-dashboard.component';
import { AuthGuard } from './auth.guard';
import { ProjectDetailsComponent } from './admin/admin-dashboard/project/project-details/project-details.component';
import { AddEditProjectComponent } from './admin/admin-dashboard/project/add-edit-project/add-edit-project.component';
import { ProjectListComponent } from './admin/admin-dashboard/project/project-List/projectList.component';
import { InvoiceListComponent } from './admin/admin-dashboard/invoice/invoice-List/invoiceList.component';
import { AddEditInvoiceComponent } from './admin/admin-dashboard/invoice/add-edit-invoice/add-edit-invoice.component';
import { InvoiceDetailsComponent } from './admin/admin-dashboard/invoice/invoice-details/invoice-details.component';
import { ClientListComponent } from './admin/admin-dashboard/client/client-List/clientList.component';
import { AddEditClientComponent } from './admin/admin-dashboard/client/add-edit-client/add-edit-client.component';
import { ClientDetailsComponent } from './admin/admin-dashboard/client/client-details/client-details.component';
import { CompanyListComponent } from './admin/admin-dashboard/company/company-List/companyList.component';
import { AddEditCompanyComponent } from './admin/admin-dashboard/company/add-edit-company/add-edit-company.component';
import { CompanyDetailsComponent } from './admin/admin-dashboard/company/company-details/company-details.component';
import { EmployeeListComponent } from './admin/admin-dashboard/employee/employee-list/employee-list.component';
import { EmployeeEditComponent } from './admin/admin-dashboard/employee/employee-edit/employee-edit.component';
import { EmployeeDetailsComponent } from './admin/admin-dashboard/employee/employee-details/employee-details.component';
import { TodoListComponent } from './admin/admin-dashboard/todos/todo-list/todo-list.component';
import { SuperAdminGuard } from './guards/check-super-admin.guard';

export const routes: Routes = [
  {
    path:'',
    pathMatch:'full',
    redirectTo : 'auth/login'
  },
    {
        path: 'auth',
        component: AdminAuthComponent,
        children: [
          {
            path: 'login',
            component: LoginComponent,
          },
        ],

    },
    {
      path:'admin',
      component: AdminDashboardComponent, 
      canActivate: [AuthGuard],   
      children:[
        {
          path: 'project',
          children: [
            {
              path:'list',
              component: ProjectListComponent,
              canActivate: [AuthGuard]
            },
            {
              path:'add',
              component:AddEditProjectComponent,
              canActivate: [AuthGuard]
    
            },
            {
              path:'edit/:id',
              component:AddEditProjectComponent,
              canActivate: [AuthGuard]
    
            },
            {
              path:'project-detail/:id',
              component:ProjectDetailsComponent,
              canActivate: [AuthGuard]
            }
          ], canActivate:[SuperAdminGuard]
        },
        {
          path: 'client',
          children: [
            {
              path:'list',
              component: ClientListComponent,
              canActivate: [AuthGuard]
            },
            {
              path:'add',
              component:AddEditClientComponent,
              canActivate: [AuthGuard]
    
            },
            {
              path:'edit/:id',
              component:AddEditClientComponent,
              canActivate: [AuthGuard]
    
            },
            {
              path:'client-detail/:id',
              component:ClientDetailsComponent,
              canActivate: [AuthGuard]
            }
          ], canActivate:[SuperAdminGuard]
        },
        {
          path: 'invoice',
          children: [
            {
              path:'list',
              component: InvoiceListComponent,
              canActivate: [AuthGuard]
            },
            {
              path:'add',
              component:AddEditInvoiceComponent,
              canActivate: [AuthGuard]
    
            },
            {
              path:'edit/:id',
              component:AddEditInvoiceComponent,
              canActivate: [AuthGuard]
    
            },
            {
              path:'invoice-detail/:id',
              component:InvoiceDetailsComponent,
              canActivate: [AuthGuard]
            }
          ], canActivate:[SuperAdminGuard]
        },
        {
          path: 'company',
          children: [
            {
              path:'list',
              component: CompanyListComponent,
              canActivate: [AuthGuard]
            },
            {
              path:'add',
              component:AddEditCompanyComponent,
              canActivate: [AuthGuard]
    
            },
            {
              path:'edit/:id',
              component:AddEditCompanyComponent,
              canActivate: [AuthGuard]
    
            },
            {
              path:'company-detail/:id',
              component:CompanyDetailsComponent,
              canActivate: [AuthGuard]
            }
          ], canActivate:[SuperAdminGuard]
        },
        {
          path: 'employee',
          children: [
            {
              path:'list',
              component: EmployeeListComponent,
              canActivate: [AuthGuard]
            },
            {
              path:'edit/:id',
              component:EmployeeEditComponent,
              canActivate: [AuthGuard]
    
            },
            {
              path:'employee-detail/:id',
              component:EmployeeDetailsComponent,
              canActivate: [AuthGuard]
            }
          ], canActivate:[SuperAdminGuard]
        },
        {
          path: 'todos',
          children: [
            {
              path:'list',
              component: TodoListComponent,
            },
          ]
        },
        
      ]
    }
];
