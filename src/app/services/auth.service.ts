import { inject, Injectable } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { where } from "firebase/firestore";
import { Login, User } from "../models/club-manager.models";
import { AlertsService } from "./alerts.service";
import { Router } from "@angular/router";
import CryptoJS from "crypto-js";
import { environment, secrets } from "../environment.prod";
import { BehaviorSubject, Subject, firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
    loggedUser$: BehaviorSubject<Login | null> = new BehaviorSubject<Login | null>(null);
    loggedUser: User | null = null;

    private firestoreService = inject(FirestoreService);
    private alertsService = inject(AlertsService);
    private router = inject(Router);
    constructor() {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            this.loggedUser = JSON.parse(storedUser);
        }
    }

    loginUser(user: string, password: string) {
        this.firestoreService.getCollection<Login>('Logins', where('login', '==', user))
            .subscribe(async login => {
                let userLogin: Login = login[0];
                debugger
                if (userLogin != null && password == userLogin?.password) {
                    await this.getLoggedUser(userLogin.usuarioUID);
                    this.loggedUser$.next(userLogin);
                    this.router.navigate(['/dashboard']);
                } else {
                    this.alertsService.error('Usuario o contraseña incorrectos');
                    this.router.navigate(['/login']);
                }
            });
    }

    loginAdmin(user: string, password: string) {
        this.firestoreService.getCollection<Login>('Admins', where('login', '==', user))
            .subscribe(async login => {
                let userLogin: Login = login[0];
                if (userLogin != null && password == userLogin?.password) {
                    await this.getLoggedUser(userLogin.usuarioUID);
                    this.loggedUser$.next(userLogin);
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

    async getLoggedUser(userId: string): Promise<void> {
        try {
            const user = await firstValueFrom(this.firestoreService.getDoc<User>('users', userId));
            if (user) {
                this.loggedUser = user;
                localStorage.setItem('loggedUser', JSON.stringify(user));
            }
        } catch (error) {
            console.error('Error fetching user', error);
        }
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

    logout() {
        this.loggedUser$.next(null);
        this.loggedUser = null;
        localStorage.removeItem('loggedUser');
        this.router.navigate(['/login']);
    }
}