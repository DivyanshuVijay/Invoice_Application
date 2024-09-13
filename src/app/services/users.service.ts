import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, docData, Firestore, orderBy, query, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  firestore: Firestore = inject(Firestore);

  constructor() { }

  //update User
  updateUser(project: any, projectId: string) {
    let documentRef = doc(this.firestore, `users/${projectId}`);
    return updateDoc(documentRef, project);
  }


  //get Single User
  getSingleUser(projectId: string) {
    let documentRef = doc(this.firestore, `users/${projectId}`);
    return docData(documentRef);
  }
  

  //get all Users
  getAllUsers() {
    let collectionRef = collection(this.firestore, 'users');
    let queryRef = query(collectionRef, orderBy('joining_date', 'desc'));
    return collectionData(queryRef, { idField: 'id' });
  }

}
