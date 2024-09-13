import { Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';
import { deleteObject, getDownloadURL, ref, Storage, uploadBytes } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class FileuploadService {
  constructor(private storage: Storage, private firestore: Firestore) {}

  async uploadFile(file: File) {
    console.log('File : ', file);
    const timestamp = new Date().getTime();
    const filePath = `snapshots/${timestamp}_${file.name}`;
    const pathRef = ref(this.storage, filePath);
    const uploadTask = await uploadBytes(pathRef, file);
    const url = await getDownloadURL(uploadTask.ref);
    console.log({ url: url, path: filePath });
    return { url: url, path: filePath };
  }

  async deleteFile(imagePath: string) {
    //   // Delete image from Firebase Storage
    try {
      const imageRef = ref(this.storage, imagePath);
      await deleteObject(imageRef);
    } catch (error) {
      console.log('Error occured while deleting image', error);
    }
  }
}
