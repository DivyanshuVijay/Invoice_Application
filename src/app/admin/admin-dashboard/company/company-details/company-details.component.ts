import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CommentsService } from '../../../../services/comments.service';
import { CompanyService } from '../../../../services/company.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupComponent } from '../../../../components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { FileuploadService } from '../../../../services/fileupload.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-company-details',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe],
  templateUrl: './company-details.component.html',
  styleUrl: './company-details.component.css'
})
export class CompanyDetailsComponent implements OnInit {
  companyId: any = null;
  private companyService = inject(CompanyService)
  private commentService = inject(CommentsService)
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private commonService = inject(CommonService);

  company : any = null;
  comments: any = []
  filteredComments : any[] =[];
  private dialogOpen: boolean = false; // Flag to check if dialog is open
  previewCommentImage : any = null;
  selectedFileType: any = null; // To store selected file type
  private fileuploadService = inject(FileuploadService);
  @ViewChild('fileInput') fileInput!: ElementRef;

  commentForm = new FormGroup({
    message : new FormControl(null),
    image : new FormControl(null),
  })

  searchCommentForm = new FormGroup({
    textToSearch : new FormControl('', Validators.required)
  })

 
  ngOnInit(){
    this.companyId = this.route.snapshot.paramMap.get('id');
    if(this.companyId){
      this.loadCompany(this.companyId)
      this.commentService.getAllComments(`company/${this.companyId}/comments`).subscribe((res:any)=>{
        this.comments = res;
        this.filteredComments = res;
      })
    }
  }

  constructor(private toastr: ToastrService, public dialog:MatDialog){}

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

      this.commentService.addComment(comment, `company/${this.companyId}/comments`).then(()=>{
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

        this.commentService.deleteComment(comment.id,'company', this.companyId).then(()=>{
          this.toastr.success("Comment Deleted!!");
        }).catch((error)=>{
          this.toastr.error("Error occured while Deleting.")
        });
      }
    }); 
  }


      // to open a image in other tab : 
      openImage(url : any){
        window.open(url, '_blank'); // Opens the link in a new tab
      }




  async loadCompany(companyId: string){
     this.companyService.getSingleCompany(companyId).subscribe((res:any)=>{
      if(res){
        this.company = res
      }
    })
  }
}
