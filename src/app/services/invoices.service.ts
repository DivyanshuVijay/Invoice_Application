import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, orderBy, query, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService {
  firestore: Firestore = inject(Firestore);

  constructor() { }

  //add invoices
  addInvoice(invoice: any) {
    let collectionRef = collection(this.firestore, 'invoices');
    return addDoc(collectionRef, invoice);
  }


  //update invoices
  updateInvoice(invoice: any, invoiceId: string) {
    let documentRef = doc(this.firestore, `invoices/${invoiceId}`);
    return updateDoc(documentRef, invoice);
  }

    // update invoice status
    updateInvoiceStatus(invoiceId: string, status: string) {
      let documentRef = doc(this.firestore, `invoices/${invoiceId}`);
      return updateDoc(documentRef, { status });
    }

  
  //delete invoices
  deleteInvoice(invoiceId: string){
    let documentRef = doc(this.firestore, `invoices/${invoiceId}`);
    return deleteDoc(documentRef);
  }

  
  //get Single invoices
  getSingleInvoice(invoiceId: string) {
    let documentRef = doc(this.firestore, `invoices/${invoiceId}`);
    return docData(documentRef);
  }
  

  //get all invoices
  getAllInvoices() {
    let collectionRef = collection(this.firestore, 'invoices');
    let queryRef = query(collectionRef, orderBy('createdAt', 'desc'));
    return collectionData(queryRef, { idField: 'id' });
  }

}
