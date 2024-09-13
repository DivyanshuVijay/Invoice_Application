import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CompanyService } from '../../../../services/company.service';
import { FileuploadService } from '../../../../services/fileupload.service';
import { ToastrService } from 'ngx-toastr';
import { NgClass } from '@angular/common';


@Component({
  selector: 'app-add-edit-company',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './add-edit-company.component.html',
  styleUrl: './add-edit-company.component.css'
})
export class AddEditCompanyComponent {
  companyId: any = null;
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private companyService = inject(CompanyService)
  private fileuploadService = inject(FileuploadService);
  previewLogoImage: string = '';
  logoImagePathToDelete: string = '';



  constructor(private toastr: ToastrService){
    this.companyId = this.route.snapshot.paramMap.get('id');
    if(this.companyId){
      this.loadCompany(this.companyId)
    }
  }


  loadCompany(companyId: string){
    this.companyService.getSingleCompany(companyId).subscribe((company:any)=>{
      console.log(company)
      if(company){
        this.companyForm.patchValue(company);
      }
    })
  }

  companyForm = new FormGroup({
    name : new FormControl('', Validators.required),
    prefix : new FormControl('', Validators.required),
    address : new FormControl('', Validators.required),
    email : new FormControl('', [Validators.required, Validators.email]),
    website : new FormControl('', Validators.required),
    accountNumber : new FormControl('', Validators.required),
    phone : new FormControl('', Validators.required),
    bank : new FormControl('', Validators.required),
    branch : new FormControl('', Validators.required),
    ifscCode : new FormControl('', Validators.required),
    accountName : new FormControl('', Validators.required),
    panNumber : new FormControl('', Validators.required),
    logo: new FormControl(),
  })

  handlefileInput(event: any) {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    if (file) {
        this.previewLogoImage = imageUrl;
        this.companyForm.patchValue({ logo: file });
    }
  }

  removeLogo(){
    
  }

  async onSubmit(){
    if(this.companyForm.valid){
      const {name,prefix, address,accountNumber, accountName, website,email, panNumber, phone, bank,branch, ifscCode, logo} = this.companyForm.value;

      let logoObject = logo;

      // 
      if(this.logoImagePathToDelete){
        const path = this.logoImagePathToDelete;
        console.log('Deleting Image with path : ', path);
        await this.fileuploadService
          .deleteFile(path)
          .then(() => {
            console.log('Deleted file at path : ', path);
          })
          .catch((error) => {
            console.log('Error Occured while deleting : ', error);
          });
      }

      // 
      try {
        if (logo instanceof File) {
          logoObject = await this.fileuploadService.uploadFile(
            logo
          );
          console.log('Banner Image Uploaded Successfully!');
        }
      } catch (error) {
        console.log('Error while uploading images', error);
      }

      // 




      try {
        if(this.companyId){
          const newCompany = {
            name : name as string,
            prefix : prefix as string,
            address : address as string,
            accountNumber : accountNumber as string,
            accountName : accountName as string,
            website : website as string,
            email : email as string,
            panNumber : panNumber as string,
            phone : phone as string,
            bank : bank as string,
            branch : branch as string,
            ifscCode : ifscCode as string,
            logo : logoObject,
          }
          await this.companyService.updateCompany(newCompany, this.companyId).then(()=>{
            this.toastr.success("Company Updated!!");
            this.companyForm.reset();
            this.router.navigate(['admin/company/list']);
          }).catch((error)=>{
            this.toastr.error("Error occured while updating.")
          });
        }else{

          const newCompany = {
            name : name as string,
            prefix : prefix as string,
            address : address as string,
            accountNumber : accountNumber as string,
            accountName : accountName as string,
            website : website as string,
            email : email as string,
            panNumber : panNumber as string,
            phone : phone as string,
            bank : bank as string,
            branch : branch as string,
            ifscCode : ifscCode as string,
            logo : logoObject,
            lastInvoiceNumber : 0,
          }
          await this.companyService.addCompany(newCompany).then(()=>{
            this.toastr.success("Company Created!!");
            this.companyForm.reset();
            this.router.navigate(['admin/company/list']);
          }).catch((error)=>{
            this.toastr.error("Error occured while creating.")
          });
        }
      } catch (error) {
        console.log('Error occurred while saving company:', error);
      }

    } else {
      this.companyForm.markAllAsTouched();  // Mark all controls as touched to trigger validation messages
      return;
    }
  }
}
