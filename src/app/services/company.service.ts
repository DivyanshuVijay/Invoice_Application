import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, getDoc, updateDoc } from '@angular/fire/firestore';
import { FileuploadService } from './fileupload.service';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  firestore: Firestore = inject(Firestore);

  private fileUploadService = inject(FileuploadService);

  constructor() { }

  //add client
  addCompany(company: any) {
    let collectionRef = collection(this.firestore, 'company');
    return addDoc(collectionRef, company);
  }


  //update client
  updateCompany(company: any, companyId: string) {
    let documentRef = doc(this.firestore, `company/${companyId}`);
    return updateDoc(documentRef, company);
  }
  
  // Increase last invoice number by one
    async increaseLastInvoiceNumber(companyId: string) {
      const documentRef = doc(this.firestore, `company/${companyId}`);
      const documentSnapshot = await getDoc(documentRef);
      
      if (documentSnapshot.exists()) {
        const currentInvoiceNumber = documentSnapshot.data()['lastInvoiceNumber'];
        console.log(currentInvoiceNumber);
        return updateDoc(documentRef, {
          "lastInvoiceNumber": currentInvoiceNumber + 1,
        });
      } else {
        console.error(`Company document not found for ID: ${companyId}`);
        return null;
      }
    }

  
  
  //delete client
  async deleteCompany(clientId: string, logoPath : string){
    let documentRef = doc(this.firestore, `company/${clientId}`);

    if(logoPath){
      try {
        await this.fileUploadService.deleteFile(logoPath);
        console.log("Logo Deleted Successfully.")
      } catch (error) {
        console.log("Error while deleting logo : ", error)
      }
    }
    return deleteDoc(documentRef);
  }

  
  //get Single client
  getSingleCompany(clientId: string) {
    let documentRef = doc(this.firestore, `company/${clientId}`);
    return docData(documentRef);
  }
  

  //get all client
  getAllCompany() {
    let collectionRef = collection(this.firestore, 'company');
    return collectionData(collectionRef, { idField: 'id' });
  }
}
