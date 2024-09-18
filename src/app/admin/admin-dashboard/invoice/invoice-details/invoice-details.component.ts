import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe, NgClass } from '@angular/common';
import { CommentsService } from '../../../../services/comments.service';
import { InvoicesService } from '../../../../services/invoices.service';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { PdfTemplateComponent } from '../../../../components/pdf-template/pdf-template.component';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupComponent } from '../../../../components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { FileuploadService } from '../../../../services/fileupload.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-invoice-details',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, PdfTemplateComponent, CurrencyPipe, NgClass],
  templateUrl: './invoice-details.component.html',
  styleUrl: './invoice-details.component.css'
})
export class InvoiceDetailsComponent implements OnInit {
  invoiceId: any = null;
  private invoiceService = inject(InvoicesService)
  private commentService = inject(CommentsService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private commonService = inject(CommonService);

  invoice : any = null;
  comments: any[] = [];
  filteredComments : any[] =[];
  private dialogOpen: boolean = false; // Flag to check if dialog is open
  previewCommentImage : any = null;
  selectedFileType: any = null; // To store selected file type
  private fileuploadService = inject(FileuploadService);
  @ViewChild('fileInput') fileInput!: ElementRef;

  
  @ViewChild(PdfTemplateComponent) Template!:  PdfTemplateComponent;

  commentForm = new FormGroup({
    message : new FormControl(null),
    image : new FormControl(null),
  })

  constructor(private toastr: ToastrService, public dialog:MatDialog){}
 
  ngOnInit(){
    this.invoiceId = this.route.snapshot.paramMap.get('id');
    if(this.invoiceId){
      this.loadInvoice(this.invoiceId)
      console.log(this.invoice)
      this.commentService.getAllComments(`invoice/${this.invoiceId}/comments`).subscribe((res:any)=>{
        this.comments = res;
        this.filteredComments = res;
      })
    }
  }

  searchCommentForm = new FormGroup({
    textToSearch : new FormControl('', Validators.required)
  })

  removePreviewImage(){
    this.previewCommentImage = null;
  }

  openFileSelector(fileType: string) {
    this.selectedFileType = '';
    this.selectedFileType = fileType;
    this.fileInput.nativeElement.click();
  }

  handlefileInput(event: any) {
    const file = event.target.files[0];
    const imageUrl = URL.createObjectURL(file);
    if (file) {
        this.previewCommentImage = imageUrl;
        this.commentForm.patchValue({ image: file });
    }
    console.log(file)
  }

  async addComment(){
    if(this.commentForm.value.image || this.commentForm.value.message){
      this.commonService.showLoader();
      let imageObject : any = this.commentForm.value.image;
      if(imageObject){
        try {
          if(imageObject instanceof File){
            imageObject = await this.fileuploadService.uploadFile(this.commentForm.value.image!);
          }
        } catch (error) {
          console.log('Error while uploading image', error);
        }
      }
      let comment ={
        message : this.commentForm.value.message,
        imageObject : imageObject,
        createdAt : new Date(),
        fileType: this.selectedFileType 
      }

      this.commentService.addComment(comment, `invoice/${this.invoiceId}/comments`).then(()=>{
        this.previewCommentImage = null;
        this.commentForm.reset();
        this.commonService.hideLoader();
        this.toastr.success("Comment Added!!");
      }).catch((error)=>{
        this.toastr.error("Error occured while Adding.")
        // console.log("Error while adding comment : ",error)
      })
    }
  }



  async loadInvoice(invoiceId: string){
     this.invoiceService.getSingleInvoice(invoiceId).subscribe((res:any)=>{
      if(res){
        this.invoice = res
      }
    })
  }

  searchComment() {
    const searchTerm = this.searchCommentForm.value.textToSearch;
    
    this.filteredComments = this.comments.filter((comment : any) =>{
      const matchesSearchTerm = searchTerm ? JSON.stringify(comment).toLowerCase().includes(searchTerm.toLowerCase()) : true;

      return matchesSearchTerm;
    })  
  }
  
  

  deleteComment(comment :any){ 
    if (this.dialogOpen) return; 
    this.dialogOpen = true;

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {title: 'Delete Confirm', message: 'Are you sure you want to Delete Comment?'},
    });
  
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false; 
      if(result == 'yes'){
        if(comment.imageObject?.path){
          this.fileuploadService.deleteFile(comment.imageObject?.path);
        } 
        this.commentService.deleteComment(comment.id,'invoice', this.invoiceId).then(()=>{
          this.toastr.success("Comment Deleted!!");
        }).catch((error)=>{
          this.toastr.error("Error occured while Deleting.")
        });
      }
    }); 
  }


  downloadPDF(){
    this.Template.downloadPdf(this.invoice);
  }

    // to open a image in other tab : 
    openImage(url : any){
      window.open(url, '_blank'); // Opens the link in a new tab
    }
}
