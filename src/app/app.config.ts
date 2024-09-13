import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { firebaseConfig } from './enviroment';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp(firebaseConfig)), provideFirestore(() => getFirestore()),   provideStorage(() => getStorage()),provideAuth(() => getAuth()), provideAnimationsAsync(),provideAnimationsAsync(),provideToastr(), provideAnimationsAsync(),]
};
