import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, orderBy, query } from '@angular/fire/firestore';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private firestore = inject(Firestore);
  constructor() { }


    //add comment
    addComment(comment: any, collectionName : string) {
      let collectionRef = collection(this.firestore, collectionName);
      return addDoc(collectionRef, comment);
    }

    //get All Comment
    getAllComments(collectionName : string) {
      let collectionRef = collection(this.firestore, collectionName);
      let queryRef = query(collectionRef, orderBy('createdAt', "desc"));
      return collectionData(queryRef, { idField: 'id' });
    }

    //delete invoices
    deleteComment(commentId: string, collectionName : string, docId: string){
      let documentRef = doc(this.firestore, `${collectionName}/${docId}/comments/${commentId}`);
      return deleteDoc(documentRef);
    }
}

