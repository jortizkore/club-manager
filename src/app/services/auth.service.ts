import { inject, Injectable } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { where } from "firebase/firestore";
import { Login } from "../models/club-manager.models";
import { AlertsService } from "./alerts.service";
import { Router } from "@angular/router";
import CryptoJS from "crypto-js";
import { environment, secrets } from "../environment.prod";

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
                if (userLogin != null && password == this.decryptPassword(userLogin?.password)) {
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
                if (userLogin != null && password == this.decryptPassword(userLogin?.password)) {
                    this.loggedUser = userLogin;
                    this.router.navigate(['/dashboard']);
                } else {
                    this.alertsService.error('Usuario o contraseña incorrectos');
                    this.router.navigate(['/login']);
                }
            });
    }

    encryptPassword(password: string): string {
        return CryptoJS.AES.encrypt(password, secrets.passwordSecret).toString();
    }

    decryptPassword(password: string): string {
        return CryptoJS.AES.decrypt(password, secrets.passwordSecret).toString();
    }

    registerUser(clubID: string, login: string, password: string) {
        const newLogin = {
            clubID: clubID,
            login: login,
            password: this.encryptPassword(password),
            ultimoLogin: this.formatDate(new Date()),
            usuarioUID: 'NA'
        };
        this.firestoreService.addDoc('Logins', newLogin).then(() => {
            this.alertsService.success('Registro exitoso');
            this.router.navigate(['/login']);
        }).catch(error => {
            console.error(error);
            this.alertsService.error('Error al registrar');
        });
    }

    private formatDate(date: Date): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
    }
}