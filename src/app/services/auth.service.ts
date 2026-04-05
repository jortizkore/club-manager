import { inject, Injectable } from "@angular/core";
import { FirestoreService } from "./firestore.service";
import { where } from "firebase/firestore";
import { Login, Role, User } from "../models/club-manager.models";
import { AlertsService } from "./alerts.service";
import { Router } from "@angular/router";
import CryptoJS from "crypto-js";
import { secrets } from "../environment.prod";
import { BehaviorSubject, firstValueFrom } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
    loggedUser$: BehaviorSubject<Login | null> = new BehaviorSubject<Login | null>(null);
    loggedUser: User | null = null;

    private firestoreService = inject(FirestoreService);
    private alertsService = inject(AlertsService);
    private router = inject(Router);
    userRoles: string[] = [];

    constructor() {
        const storedUser = localStorage.getItem('loggedUser');
        if (storedUser) {
            this.loggedUser = JSON.parse(storedUser);
        }
        const storedPerms = localStorage.getItem('userPermissions');
        if (storedPerms) {
            this.userRoles = JSON.parse(storedPerms);
        }
    }

    loginUser(user: string, password: string) {
        this.firestoreService.getCollection<Login>('Logins', where('login', '==', user))
            .subscribe(async login => {

                let userLogin: Login = login[0];
                const decryptedPassword = this.decryptPassword(userLogin?.password);
                if (userLogin != null && password == decryptedPassword) {
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
        return CryptoJS.AES.decrypt(password, secrets.passwordSecret).toString(CryptoJS.enc.Utf8);
    }

    async getLoggedUser(userId: string): Promise<void> {
        try {
            const user = await firstValueFrom(this.firestoreService.getDoc<User>('users', userId));
            if (user) {
                this.loggedUser = user;
                localStorage.setItem('loggedUser', JSON.stringify(user));
                await this.loadUserPermissions(user.RoleId);
            }
        } catch (error) {
            console.error('Error fetching user', error);
        }
    }

    async loadUserPermissions(roleId: string) {
        if (roleId) {
            const role = await firstValueFrom(this.firestoreService.getDoc<Role>('Roles', roleId));
            if (role && role.permissions) {
                this.userRoles = role.permissions.map(p => p.NombrePermiso);
                localStorage.setItem('userPermissions', JSON.stringify(this.userRoles));
            }
        }
    }

    createUser(user: User) {
        this.firestoreService.addDoc('users', user).then(() => {
            this.alertsService.success('Usuario creado exitosamente');
        }).catch(error => {
            console.error(error);
            this.alertsService.error('Error al crear usuario');
        });
    }

    registerUser(clubID: string, login: string, password: string, usuarioUID: string = 'NA') {
        const newLogin = {
            clubID: clubID,
            login: login,
            password: this.encryptPassword(password),
            ultimoLogin: this.formatDate(new Date()),
            usuarioUID: usuarioUID
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
        this.userRoles = [];
        localStorage.removeItem('loggedUser');
        localStorage.removeItem('userPermissions');
        this.router.navigate(['/login']);
    }

    userHasPermission(permissionName: string): boolean {
        return this.userRoles.includes(permissionName);
    }
}