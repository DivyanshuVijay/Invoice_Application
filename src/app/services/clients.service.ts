import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, orderBy, query, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {

  firestore: Firestore = inject(Firestore);

  constructor() { }

  //add client
  addClient(project: any) {
    let collectionRef = collection(this.firestore, 'client');
    return addDoc(collectionRef, project);
  }


  //update client
  updateClient(project: any, clientId: string) {
    let documentRef = doc(this.firestore, `client/${clientId}`);
    return updateDoc(documentRef, project);
  }

  
  //delete client
  deleteClient(clientId: string){
    let documentRef = doc(this.firestore, `client/${clientId}`);
    return deleteDoc(documentRef);
  }

  
  //get Single client
  getSingleClient(clientId: string) {
    let documentRef = doc(this.firestore, `client/${clientId}`);
    return docData(documentRef);
  }
  

  //get all client
  getAllClients() {
    let collectionRef = collection(this.firestore, 'client');
    let queryRef = query(collectionRef, orderBy('createdOn', 'desc'));
    return collectionData(queryRef, { idField: 'id' });
  }
}
