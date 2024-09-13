import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  firestore: Firestore = inject(Firestore);

  constructor() { }

  //add client
  addTodo(project: any) {
    let collectionRef = collection(this.firestore, 'todos');
    return addDoc(collectionRef, project);
  }


  //update client
  updateTodo(project: any, clientId: string) {
    let documentRef = doc(this.firestore, `todos/${clientId}`);
    return updateDoc(documentRef, project);
  }

  
  //delete client
  deleteTodo(clientId: string){
    let documentRef = doc(this.firestore, `todos/${clientId}`);
    return deleteDoc(documentRef);
  }

  
  //get Single client
  getSingleTodo(clientId: string) {
    let documentRef = doc(this.firestore, `todos/${clientId}`);
    return docData(documentRef);
  }
  

  //get all client
  getAllTodos() {
    let collectionRef = collection(this.firestore, 'todos');
    return collectionData(collectionRef, { idField: 'id' });
  }
}
