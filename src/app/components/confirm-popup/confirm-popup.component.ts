import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialog,
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialogContent,
  MatDialogActions
} from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-popup',
  standalone: true,
  imports: [MatButtonModule,MatDialogContent,MatDialogActions],
  templateUrl: './confirm-popup.component.html',
  styleUrl: './confirm-popup.component.css'
})
export class ConfirmPopupComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}


  close(value:any){
    this.dialogRef.close(value)
  }
}
