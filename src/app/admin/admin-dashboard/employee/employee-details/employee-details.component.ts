import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { UsersService } from '../../../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommentsService } from '../../../../services/comments.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmPopupComponent } from '../../../../components/confirm-popup/confirm-popup.component';
import { FileuploadService } from '../../../../services/fileupload.service';
import { CommonService } from '../../../../services/common.service';

@Component({
  selector: 'app-employee-details',
  standalone: true,
  imports: [DatePipe, ReactiveFormsModule],
  templateUrl: './employee-details.component.html',
  styleUrl: './employee-details.component.css'
})
export class EmployeeDetailsComponent {
  employee: any = null;
  private userService = inject(UsersService);
  private route = inject(ActivatedRoute);
  private commentService = inject(CommentsService)
  private fileuploadService = inject(FileuploadService);
  private commonService = inject(CommonService);

  employeeId : any =null;
  comments: any = [];
  filteredComments : any[] =[];
  private dialogOpen: boolean = false; // Flag to check if dialog is open
  previewCommentImage : any = null;
  selectedFileType: any = null; // To store selected file type
  @ViewChild('fileInput') fileInput!: ElementRef;

  
  constructor(private toastr: ToastrService, public dialog:MatDialog){
    this.employeeId = this.route.snapshot.paramMap.get('id');
    if (this.employeeId) {
      this.userService.getSingleUser(this.employeeId).subscribe((employee) => {
        this.employee = employee;
      });
      this.commentService.getAllComments(`users/${this.employeeId}/comments`).subscribe((res:any)=>{
        this.comments = res;
        this.filteredComments = res;
      })
    }
  }
  

  commentForm = new FormGroup({
    message : new FormControl(null),
    image : new FormControl(null),
  })

  searchCommentForm = new FormGroup({
    textToSearch : new FormControl('', Validators.required)
  })


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

      this.commentService.addComment(comment, `users/${this.employeeId}/comments`).then(()=>{
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


  removePreviewImage(){
    this.previewCommentImage = null;
  }

  deleteComment(comment :any){ 
    if (this.dialogOpen) return; 
    this.dialogOpen = true;

    const dialogRef = this.dialog.open(ConfirmPopupComponent, {
      data: {title: 'Delete Confirm', message: 'Are you sure you want to Delete Comment?'},
    });
  
    console.log(comment)
    dialogRef.afterClosed().subscribe(result => {
      this.dialogOpen = false; 
      if(result == 'yes'){
        if(comment.imageObject?.path){
          this.fileuploadService.deleteFile(comment.imageObject?.path);
        } 
        this.commentService.deleteComment(comment.id,'users', this.employeeId).then(()=>{
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

}
