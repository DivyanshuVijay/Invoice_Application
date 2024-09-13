import { AfterViewInit, Component, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoicesService } from '../../../../services/invoices.service';
import { PdfTemplateComponent } from '../../../../components/pdf-template/pdf-template.component';
import { FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CompanyService } from '../../../../services/company.service';
import { ConfirmPopupComponent } from '../../../../components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { PrintService } from '../../../../services/print.service';
import { PrintInvoiceComponent } from "../../../../components/print-invoice/print-invoice.component";
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-invoiceList',
  standalone: true,
  imports: [PdfTemplateComponent, ReactiveFormsModule, CurrencyPipe, PrintInvoiceComponent, DatePipe, FormsModule],
  templateUrl: './invoiceList.component.html',
  styleUrl: './invoiceList.component.css',
})
export class InvoiceListComponent{
  invoiceList : any[] = [];
  private invoiceService = inject(InvoicesService)
  private router = inject(Router);
  filteredInvoices : any[] = []; // Filtered invoices based on search or filter
  companies : any[]= [];
  selectedCompany: any = '';
  minEndDate: string = ''; 
  private companyService = inject(CompanyService);
  private dialogOpen: boolean = false; // Flag to check if dialog is open
  totalAmount: number = 0;
  totalTDS: number = 0;
  totalReceivedAmount: number = 0;
  private printService = inject(PrintService);

  currentDate: Date = new Date();



  invoiceFilterForm = new FormGroup({
    startDate : new FormControl('', Validators.required),
    endDate : new FormControl('',Validators.required),
    selectedCompany : new FormControl('',Validators.required),
    searchTerm : new FormControl('', Validators.required),
    tdsFilter: new FormControl(false) 
  })

  invoiceStatusForm = new FormGroup({
    status : new FormControl('')
  })

  invoiceSearchForm = new FormGroup({
    filterCompany : new FormControl('', Validators.required)
  })

  
  @ViewChild(PdfTemplateComponent) Template!:  PdfTemplateComponent;
  
  
  constructor(public dialog:MatDialog, public commonService:CommonService){
    this.invoiceService.getAllInvoices().subscribe((res: any) => {
      this.invoiceList = res;
      // Initially, show all invoices
      this.filteredInvoices = this.invoiceList;
      
      this.calculateTotals();

    });
    this.companyService.getAllCompany().subscribe((res:any)=>{
      this.companies = res;
    })
  }


  updateStatus(invoice:any){
      // Update the status of the invoice
  this.invoiceService.updateInvoiceStatus(invoice.id, invoice.status).then(() => {
    console.log("Status Updated Succesfully")
  }).catch((error) => {
    console.log("Error while Status Updating")
  });
  }

  isOverdue(invoice: any): boolean {
    const expectedDate = new Date(invoice.expected_payment_date);
    const currentDate = new Date();
    return expectedDate < currentDate;
  }

  resetFilter(){
    this.invoiceFilterForm.reset();
  }

  navigateToSingleInvoice(id:any){
    this.router.navigate([`admin/invoice-detail/${id}`])
  }

  navigateToUpdate(id:any){
    this.router.navigate([`admin/invoice/edit/${id}`])
  }

  navigateToDelete(id:any){
    if (this.dialogOpen) return; 
    this.dialogOpen = true;


    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {title: 'Delete Confirm', message: 'Are you sure you want to Delete Invoice?'},
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false; 
      if(result == 'yes'){
         this.invoiceService.deleteInvoice(id)
      }
    });
  }
  
  navigateToAddInvoice(){
    this.router.navigate([`admin/invoice/add`])
  }

  navigateToDownload(invoice:any){
    
    this.Template.downloadPdf(invoice)
  
  }

  navigateToView(id:any){
    this.router.navigate([`admin/invoice/invoice-detail/${id}`])
  }

  navigateToPrint(invoice: any) {
    if (Array.isArray(invoice)) {
      this.printService.printData(invoice); // Handle array of invoices
    } else {
      this.printService.printData([invoice]); // Wrap single invoice in an array
    }
  }

  setStartTime() {
    const startDate = this.invoiceFilterForm.value.startDate;
    this.invoiceFilterForm.value.endDate = `${this.invoiceFilterForm.value.startDate}T00:00:00`;

    // Update the minimum end date when the start date changes
    this.minEndDate = startDate!; // This will disable dates before the selected start date in the end date calendar
  }

  setEndTime(){
    this.invoiceFilterForm.value.endDate = `${this.invoiceFilterForm.value.endDate}T23:59:59`;
  }

  downloadFilteredInvoices(filteredInvoices : any){
    this.Template.downloadMultipleInvoices(filteredInvoices);
  }


  applyFilters() {
    const { startDate, endDate, selectedCompany, searchTerm, tdsFilter  } = this.invoiceFilterForm.value;
    
    let adjustedEndDate: Date | null = null;
    if (endDate) {
      adjustedEndDate = new Date(endDate);
      adjustedEndDate.setHours(23, 59, 59, 999); // Set to 11:59:59 PM
    }
  
    this.filteredInvoices = this.invoiceList.filter(invoice => {
      const invoiceDate = new Date(invoice.createdAt);
  
      const matchesCompany = selectedCompany ? invoice.company.name === selectedCompany : true;
      const matchesDateRange = (!startDate || invoiceDate >= new Date(startDate)) &&
                               (!adjustedEndDate || invoiceDate <= adjustedEndDate);
      const matchesSearchTerm = searchTerm ? JSON.stringify(invoice).toLowerCase().includes(searchTerm.toLowerCase()) : true;
      const matchesTdsFilter = tdsFilter ? invoice.tds > 0 : true;
  
      return matchesCompany && matchesDateRange && matchesSearchTerm && matchesTdsFilter;
    });
  

    this.calculateTotals();
  }

  calculateTotals(){
    this.totalAmount = this.filteredInvoices.reduce((sum, invoice) => sum + invoice.converted_inr_amount, 0);
    this.totalTDS = this.filteredInvoices.reduce((sum, invoice) => sum + invoice.converted_inr_tds , 0);
    this.totalReceivedAmount = this.totalAmount - this.totalTDS;
    // this.totalReceivedAmount = this.filteredInvoices.reduce((sum, invoice) => sum + invoice.total_recieved_amount, 0);
  }
}
  