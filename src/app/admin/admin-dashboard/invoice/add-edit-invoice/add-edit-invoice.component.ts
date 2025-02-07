import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoicesService } from '../../../../services/invoices.service';
import { accounts } from '../../../../enviroment';
import { ClientsService } from '../../../../services/clients.service';
import { CompanyService } from '../../../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { formatDate, NgClass } from '@angular/common';
import { ProjectService } from '../../../../services/project.service';
import { EditorModule, TINYMCE_SCRIPT_SRC } from '@tinymce/tinymce-angular';

@Component({
  selector: 'app-add-edit-invoice',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, EditorModule],
  templateUrl: './add-edit-invoice.component.html',
  styleUrl: './add-edit-invoice.component.css',
  providers: [
    { provide: TINYMCE_SCRIPT_SRC, useValue: 'tinymce/tinymce.min.js' },
  ],
})
export class AddEditInvoiceComponent implements OnInit {
  invoiceForm!: FormGroup;
  accounts = accounts
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  invoiceId: any = null;
  clients : any[] = [];
  companies : any[]= [];
  projects : any = null;
  filteredProjects : any[] = [];
  private invoiceService = inject(InvoicesService);
  private clientService = inject(ClientsService);
  private companyService = inject(CompanyService);
  selectedCompany : any = null;
  companyCurrentInvoiceNumber : any = null;
  selectedCurrencySymbol: string = '₹';
  currencyConversionRate: number = 1; // Default conversion rate for INR
  convertedInrAmount: number = 0;
  convertedInrTds: number = 0;
  private projectService = inject(ProjectService)
  
  compareFn( optionOne : any, optionTwo :any ) : boolean {
    return optionOne?.id === optionTwo?.id;
  }

  editorConfig = {
    base_url: '/tinymce',
    suffix: '.min',
    plugins: 'lists link image table wordcount',
  };

  
  constructor(private fb: FormBuilder,private toastr: ToastrService){

    this.invoiceForm = this.fb.group({
      invoiceNumber: null,
      clientName: [null, Validators.required],
      status: ['CREATED'],  // Default status
      description: [''],
      company: [null, Validators.required],
      tds: 0,
      discount : 0,
      items: this.fb.array([
        this.createItem()
      ]),
      total_recieved_amount : null,
      amount : null,
      createdAt: null,
      assigned_project : [null,Validators.required],
      expected_payment_date : [null],
    });

    this.invoiceId = this.route.snapshot.paramMap.get('id');
    this.clientService.getAllClients().subscribe((res:any)=>{
      this.clients = res;
    })
    this.companyService.getAllCompany().subscribe((res:any)=>{
      this.companies = res;
    })

  }

  loadInvoice(invoiceId: string) {
    this.invoiceService.getSingleInvoice(invoiceId).subscribe((invoice: any) => {
      console.log(invoice)
      if (invoice) {
        this.invoiceForm.patchValue(invoice);
        this.selectedCurrencySymbol = invoice.selectedCurrencySymbol || '₹'; // Set the currency symbol
        this.currencyConversionRate = this.getConversionRate(invoice.selectedCurrencyCode || 'INR'); // Set the conversion rate
        this.updateConvertedAmounts();
  
        // Clear the existing items in the form array
        this.Items.clear();
  
        // Create input fields for each item in the invoice
        invoice.items.forEach((item: any) => {
          this.Items.push(this.createItem());
        });
  
        // Patch the values of the items in the form array
        this.Items.controls.forEach((control: any, index: number) => {
          control.patchValue(invoice.items[index]);
        });
      }
    });
  }


  applyFilters() {
    const selectedClient = this.invoiceForm.value.clientName;

    this.filteredProjects = this.projects.filter((project : any) => {
      return selectedClient ? project.client.name === selectedClient.name : true;
    });
  }
  
  getCurrencyCode(symbol: string): string {
    switch (symbol) {
      case '₹':
        return 'INR';
      case '$':
        return 'USD';
      case '€':
        return 'EUR';
      default:
        return 'INR';
    }
  }

  ngOnInit(){
    
    // Set default value for 'createdAt' to current date in 'YYYY-MM-DD' format
    const currentDate = new Date().toISOString().split('T')[0]; // Format the date as YYYY-MM-DD
    this.invoiceForm.patchValue({ createdAt: currentDate });
    
    if(this.invoiceId){
      this.loadInvoice(this.invoiceId)
    }
    // Listen for changes on the company field to generate the invoice number
    this.invoiceForm.get('company')?.valueChanges.subscribe((company: any) => {
      console.log(company);
      if (company) {
          const prefix = company.prefix;
          const currentDate = new Date();
          const currentMonth = formatDate(currentDate, 'MM', 'en');
          this.companyCurrentInvoiceNumber = company.lastInvoiceNumber + 1;
          const updatedNumber = `${prefix}/${currentMonth}/${this.companyCurrentInvoiceNumber}`;
          
          this.invoiceForm.patchValue({ invoiceNumber: updatedNumber });
      }
    });


    this.projectService.getAllProjects().subscribe((res:any)=>{
      this.filteredProjects = res;
      this.projects = res;
    })

    // this.items().valueChanges.subscribe((values: any[]) => {
    //   this.amount_without_total();
    //   this.calculateTotal();
    // });


    // this.invoiceForm.get('amount')?.valueChanges.subscribe(() => {
    //   this.updateConvertedInrAmount();
    // });

  }


  createItem(): FormGroup {
    return this.fb.group({
      name: [''],
      quantity: 1,
      price: null,
      total : 0
    });
  }

  get Items(){
    return this.invoiceForm.get('items') as FormArray;
  }

  addItem() {
    this.Items.push(this.createItem());
  }

  removeItem(index: number) {
    console.log(index)
    if (this.Items.length > 1) {
        this.Items.controls.splice(index, 1);
        this.invoiceForm.updateValueAndValidity()
        console.log(this.Items)
        this.calculateTotalAmount();  // Update the total amount after removing
    }
  }

  // Calculate the total amount based on form array items
  calculateTotalAmount(): number {
    const items = JSON.parse(JSON.stringify(this.Items.value));
    console.log(items)
    return items.reduce((acc : any, item : any) => acc + (item.quantity * item.price || 0), 0);
  }

  //to calculate the total amount of spectifc item 
  calculateItemTotal(index: number): number {
    const item = JSON.parse(JSON.stringify(this.Items.at(index).value));
    return (item.quantity * item.price) || Number(item.total) ;
  }

  amount_without_total() {
    const items = JSON.parse(JSON.stringify(this.Items.value));
    let ans = items.reduce((acc: any, item: any) => acc + (item.quantity * item.price || Number(item.total)), 0);
    // this.invoiceForm.value.amount = ans;
    this.invoiceForm.get('amount')?.patchValue(ans);
    this.updateConvertedAmounts();
    return ans;
  }

  calculateTotal(): number {
    const amount = this.amount_without_total();
    const tds = this.invoiceForm.value.tds || 0;
    const discount = this.invoiceForm.value.discount || 0;
    let ans = amount - tds - discount;
    this.invoiceForm.value.total_recieved_amount = ans;
    this.updateConvertedAmounts();
    return ans;
  }

  updateConvertedAmounts() {
    const amount = this.invoiceForm.value.amount || 0;
    const tds = this.invoiceForm.value.tds || 0;
    this.convertedInrAmount = amount * this.currencyConversionRate;
    this.convertedInrTds = tds * this.currencyConversionRate;
  }

  selectCurrency(symbol: string, currency: string) {
    this.selectedCurrencySymbol = symbol;
    this.currencyConversionRate = this.getConversionRate(currency);
    this.updateConvertedAmounts();
  }

  getConversionRate(currency: string): number {
    switch (currency) {
      case 'USD':
        return 82; // Example rate, adjust as needed
      case 'EUR':
        return 88; // Example rate, adjust as needed
      default:
        return 1; // INR
    }
  }

  onAmountChange(): void {
    this.updateConvertedInr();
  }


  updateConvertedInr(): void {
    const amount = this.invoiceForm.get('amount')?.value;
    if (this.selectedCurrencySymbol === '₹') {
      this.convertedInrAmount = amount;
    } else {
      this.convertedInrAmount = amount * this.currencyConversionRate;
    }
    
    // Update the form control value
    this.invoiceForm.get('convertedInrAmount')?.patchValue(this.convertedInrAmount );
  }
  


  onSubmit(){
    if(this.invoiceForm.valid){
      this.selectedCompany = this.invoiceForm.value.company;
      console.log(this.selectedCompany)
      let invoice ={
      invoiceNumber : this.invoiceForm.value.invoiceNumber,
      clientName : this.invoiceForm.value.clientName,
      assigned_project : this.invoiceForm.value.assigned_project,
      description : this.invoiceForm.value.description,
      company: this.invoiceForm.value.company,
      amount : this.invoiceForm.value.amount,
      items : this.invoiceForm.value.items,
      tds :this.invoiceForm.value.tds as number,
      total_recieved_amount : this.invoiceForm.value.total_recieved_amount,
      converted_inr_amount: this.convertedInrAmount,
      converted_inr_tds: this.convertedInrTds,
      selectedCurrencySymbol: this.selectedCurrencySymbol, // Store selected currency symbol
      selectedCurrencyCode: this.getCurrencyCode(this.selectedCurrencySymbol), // Store selected currency code
      createdAt : this.invoiceForm.value.createdAt,
      expected_payment_date : this.invoiceForm.value.expected_payment_date,
      discount : this.invoiceForm.value.discount,
      status : this.invoiceForm.value.status
    }
    
    if (this.invoiceId) {
      // Update existing invoice
      this.invoiceService.updateInvoice(invoice, this.invoiceId).then(() => {
        this.toastr.success("Invoice Updated!!");
        this.router.navigate(['/admin/invoice/list'])
      }).catch((error) => {
        this.toastr.error("Error occurred while updating.");
        this.router.navigate(['/admin/invoice/list'])
      });
    } else {
      // Create new invoice
      this.invoiceService.addInvoice(invoice).then(() => {
        this.companyService.increaseLastInvoiceNumber(this.selectedCompany.id).then(() => {
          console.log('Last invoice number increased successfully');
        });
          this.router.navigate(['/admin/invoice/list'])
          this.toastr.success("Invoice Created!!");
        }).catch((error) => {
          this.toastr.error("Error occurred while creating.");
          this.router.navigate(['/admin/invoice/list'])
        });
    }
  }else{
    this.invoiceForm.markAllAsTouched();  // Mark all controls as touched to trigger validation messages
    return;
  }
  }
  
}
