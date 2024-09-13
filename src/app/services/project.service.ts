import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, docData, Firestore, orderBy, query, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  firestore: Firestore = inject(Firestore);

  constructor() { }

  //add project
  addProject(project: any) {
    let collectionRef = collection(this.firestore, 'project');
    return addDoc(collectionRef, project);
  }


  //update Project
  updateProject(project: any, projectId: string) {
    let documentRef = doc(this.firestore, `project/${projectId}`);
    return updateDoc(documentRef, project);
  }

  
  //delete project
  deleteProject(projectId: string){
    let documentRef = doc(this.firestore, `project/${projectId}`);
    return deleteDoc(documentRef);
  }


  //get Single project
  getSingleProject(projectId: string) {
    let documentRef = doc(this.firestore, `project/${projectId}`);
    return docData(documentRef);
  }
  

  //get all projects
  getAllProjects() {
    let collectionRef = collection(this.firestore, 'project');
    let queryRef = query(collectionRef, orderBy('created_at', 'desc'));
    return collectionData(queryRef, { idField: 'id' });
  }




}
