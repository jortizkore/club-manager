import { inject, Injectable } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { where } from "firebase/firestore";
import { Login } from "../models/club-manager.models";
import { AlertsService } from "./alerts.service";
import { Router } from "@angular/router";
import CryptoJS from "crypto-js";

@Injectable({ providedIn: 'root' })
export class AuthService {
    loggedUser: Login | null = null;
    private firestoreService = inject(FirestoreService);
    private alertsService = inject(AlertsService);
    private router = inject(Router);
    constructor() { }

    loginUser(user: string, password: string) {
        this.firestoreService.getCollection<Login>('Logins', where('login', '==', user))
            .subscribe(login => {
                let userLogin: Login = login[0];
                if (userLogin != null && password == userLogin.password) {
                    this.loggedUser = userLogin;
                    this.router.navigate(['/dashboard']);
                } else {
                    this.alertsService.error('Usuario o contraseña incorrectos');
                    this.router.navigate(['/login']);
                }
            });
    }

    loginAdmin(user: string, password: string) {
        this.firestoreService.getCollection<Login>('Admins', where('login', '==', user))
            .subscribe(login => {
                let userLogin: Login = login[0];
                if (userLogin != null && password == userLogin.password) {
                    this.loggedUser = userLogin;
                    this.router.navigate(['/dashboard']);
                } else {
                    this.alertsService.error('Usuario o contraseña incorrectos');
                    this.router.navigate(['/login']);
                }
            });
    }

    encryptPassword(password: string): string {
        return CryptoJS.AES.encrypt(password, 'secret key 123').toString();
    }

    decryptPassword(password: string): string {
        return CryptoJS.AES.decrypt(password, 'secret key 123').toString();
    }
}