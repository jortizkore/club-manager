import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideStorage, getStorage } from '@angular/fire/storage';
import { provideAnalytics, getAnalytics } from '@angular/fire/analytics';

import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyD0uq1uKqmpO89hgjaZVRU5i5_Npw0Bw-k",
  authDomain: "club-manager-b4092.firebaseapp.com",
  projectId: "club-manager-b4092",
  storageBucket: "club-manager-b4092.firebasestorage.app",
  messagingSenderId: "962448586801",
  appId: "1:962448586801:web:bf578a574c002fa71e7d10",
  measurementId: "G-F470MYX1SZ"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideStorage(() => getStorage()),
    provideAnalytics(() => getAnalytics())
  ]
};
