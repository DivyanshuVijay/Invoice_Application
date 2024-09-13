import { Component } from '@angular/core';
import { PrintService } from '../../services/print.service';
import { CurrencyPipe, DatePipe } from '@angular/common';

@Component({
  selector: 'app-print-invoice',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
  templateUrl: './print-invoice.component.html',
  styleUrl: './print-invoice.component.css'
})
export class PrintInvoiceComponent {
  constructor(public printService : PrintService){
    console.log(printService.data)
  }

  getEmptyRows(invoice: any) {
    const itemLength = invoice.items?.length || 0;
    return Array(12 - itemLength).fill(null);
  }
}
