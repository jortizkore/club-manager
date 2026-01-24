import { Injectable, inject } from '@angular/core';
import {
    Storage,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    private storage: Storage = inject(Storage);

    constructor() { }

    async uploadFile(path: string, file: File): Promise<string> {
        const storageRef = ref(this.storage, path);
        await uploadBytes(storageRef, file);
        return getDownloadURL(storageRef);
    }

    async deleteFile(path: string): Promise<void> {
        const storageRef = ref(this.storage, path);
        return deleteObject(storageRef);
    }
}
