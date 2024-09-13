import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PrintInvoiceComponent } from "./components/print-invoice/print-invoice.component";
import { CommonService } from './services/common.service';
import { LoaderComponent } from "./components/loader/loader.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, PrintInvoiceComponent, LoaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'invoice-app';
  constructor(public commonService:CommonService){}
}
