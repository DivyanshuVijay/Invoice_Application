import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  loader=false;
  firestore: Firestore = inject(Firestore);

  constructor() { }


  showLoader(){
    this.loader=true
  }

  hideLoader(){
    this.loader=false
  }




  //project Category 
    //get all project Category
    getAllProjectCategory() {
      let collectionRef = collection(this.firestore, 'project_category');
      return collectionData(collectionRef, { idField: 'id' });
    }
  
    
    //get all sources
    getAllSources() {
      let collectionRef = collection(this.firestore, 'source');
      return collectionData(collectionRef, { idField: 'id' });
    }


    //get all status
    getAllStatus() {
      let collectionRef = collection(this.firestore, 'status');
      return collectionData(collectionRef, { idField: 'id' });
    }
}
