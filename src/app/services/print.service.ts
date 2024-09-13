import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrintService {
  data:any

  constructor() { }

  printData(data:any){
    this.data=data;

    setTimeout(() => {
      print()
    }, 1000);
  }
}
