import { CommonModule, DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-pdf-template',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './pdf-template.component.html',
  styleUrl: './pdf-template.component.css'  // make sure the filename is consistent
})
export class PdfTemplateComponent {
  invoice: any = null;
  emptyRows = Array(11).fill(null);

  constructor(public commonService: CommonService) {}

  downloadPdf(invoice: any) {
    this.invoice = invoice;
    console.log(invoice)
    this.generatePDF();
  }

  getEmptyRows() {
    const itemLength = this.invoice?.items?.length || 0;
    return Array(11 - itemLength).fill(null);
  }

  generatePDF() {
    this.commonService.showLoader();
    const element: HTMLElement = document.getElementById('invoice-template') as HTMLElement;
    const pdf = new jsPDF('p', 'mm', 'a4', true);

    setTimeout(() => {
      html2canvas(element).then((canvas) => {
        const imgData = canvas.toDataURL('image/png', 1);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice_${this.invoice.invoiceNumber}.pdf`);
        this.commonService.hideLoader();  
      }).catch((error) => {
        console.error('Error generating PDF:', error);
        this.commonService.hideLoader();  
      });
    }, 3000);
  }

  downloadMultipleInvoices(invoices: any[]) {
    this.generateMultiplePDFs(invoices);
  }

  async generateMultiplePDFs(invoices: any[]) {
    this.commonService.showLoader();
    const pdf = new jsPDF('p', 'mm', 'a4', true);

    for (let i = 0; i < invoices.length; i++) {
      this.invoice = invoices[i];
      const element: HTMLElement = document.getElementById('invoice-template') as HTMLElement;
      
      await new Promise<void>((resolve) => {
        setTimeout(() => {
          html2canvas(element).then((canvas) => {
            const imgData = canvas.toDataURL('image/png', 1);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            if (i > 0) {
              pdf.addPage();
            }

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            resolve();
          });
        }, 3000);
      });
    }

    pdf.save('All_Invoices.pdf');
    this.commonService.hideLoader();
  }
}
