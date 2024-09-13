import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { CommentsService } from '../../../../services/comments.service';
import { ClientsService } from '../../../../services/clients.service';
import { ToastrService } from 'ngx-toastr';
import { ConfirmPopupComponent } from '../../../../components/confirm-popup/confirm-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { FileuploadService } from '../../../../services/fileupload.service';

@Component({
  selector: 'app-client-details',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe],
  templateUrl: './client-details.component.html',
  styleUrl: './client-details.component.css'
})
export class ClientDetailsComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  clientId: any = null;
  private clientService = inject(ClientsService)
  private commentService = inject(CommentsService)
  private fileuploadService = inject(FileuploadService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  client : any = null;
  comments: any = []
  filteredComments : any[] =[];
  private dialogOpen: boolean = false; // Flag to check if dialog is open\
  previewCommentImage : any = null;
  selectedFileType: any = null; // To store selected file type

  commentForm = new FormGroup({
    message : new FormControl(null),
    image : new FormControl(null),
  })

  searchCommentForm = new FormGroup({
    textToSearch : new FormControl('', Validators.required)
  })

  constructor(private toastr: ToastrService, public dialog:MatDialog){}
 
  ngOnInit(){
    this.clientId = this.route.snapshot.paramMap.get('id');
    if(this.clientId){
      this.loadClient(this.clientId)
      this.commentService.getAllComments(`client/${this.clientId}/comments`).subscribe((res:any)=>{
        this.comments = res;
        this.filteredComments = res;
      })
    }
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

      this.commentService.addComment(comment, `client/${this.clientId}/comments`).then(()=>{
        this.previewCommentImage = null;
        this.commentForm.reset();
        this.toastr.success("Comment Added!!");
      }).catch((error)=>{
        this.toastr.error("Error occured while Adding.")
        // console.log("Error while adding comment : ",error)
      })
    }
  }

  // to search a comment
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
        this.commentService.deleteComment(comment.id,'client', this.clientId).then(()=>{
          this.toastr.success("Comment Deleted!!");
        }).catch((error)=>{
          this.toastr.error("Error occured while Deleting.")
        });
      }
    }); 
  }


  async loadClient(clientId: string){
     this.clientService.getSingleClient(clientId).subscribe((res:any)=>{
      if(res){
        this.client = res
      }
    })
  }



  // to open a image in other tab : 
  openImage(url : any){
    window.open(url, '_blank'); // Opens the link in a new tab
  }
}
