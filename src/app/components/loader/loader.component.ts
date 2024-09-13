import { Component } from '@angular/core';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.css'
})
export class LoaderComponent {
  constructor(){

  }
}
