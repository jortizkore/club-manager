import { Injectable, inject } from '@angular/core';
import {
    Firestore,
    collection,
    collectionData,
    doc,
    docData,
    addDoc,
    updateDoc,
    deleteDoc,
    DocumentReference,
    query,
    where,
    QueryConstraint
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class FirestoreService {
    private firestore: Firestore = inject(Firestore);

    constructor() { }

    getCollection<T>(path: string, ...constraints: QueryConstraint[]): Observable<T[]> {
        const colRef = collection(this.firestore, path);
        const q = query(colRef, ...constraints);
        return collectionData(q, { idField: 'id' }) as Observable<T[]>;
    }

    getDoc<T>(path: string, id: string): Observable<T | undefined> {
        const docRef = doc(this.firestore, `${path}/${id}`);
        return docData(docRef, { idField: 'id' }) as Observable<T | undefined>;
    }

    addDoc(path: string, data: any): Promise<DocumentReference> {
        const colRef = collection(this.firestore, path);
        return addDoc(colRef, data);
    }

    updateDoc(path: string, id: string, data: any): Promise<void> {
        const docRef = doc(this.firestore, `${path}/${id}`);
        return updateDoc(docRef, data);
    }

    deleteDoc(path: string, id: string): Promise<void> {
        const docRef = doc(this.firestore, `${path}/${id}`);
        return deleteDoc(docRef);
    }
}
