import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FirestoreService } from '../../../services/firestore.service';
import { AuthService } from '../../../services/auth.service';
import { Role, User } from '../../../models/club-manager.models';
import { AlertsService } from '../../../services/alerts.service';

@Component({
  selector: 'app-user-registration-dialog',
  standalone: true,
  imports: [
    CommonModule, ReactiveFormsModule, MatDialogModule, MatFormFieldModule,
    MatInputModule, MatSelectModule, MatButtonModule
  ],
  templateUrl: './user-registration-dialog.component.html',
  styleUrl: './user-registration-dialog.component.scss'
})
export class UserRegistrationDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private firestoreService = inject(FirestoreService);
  private authService = inject(AuthService);
  private dialogRef = inject(MatDialogRef<UserRegistrationDialogComponent>);
  private alertsService = inject(AlertsService);

  userForm: FormGroup;
  roles: Role[] = [];

  constructor() {
    this.userForm = this.fb.group({
      Nombre: ['', Validators.required],
      DocumentoDeIdentidad: ['', Validators.required],
      RoleId: ['', Validators.required],
      Celular: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Direccion: [''],
      Telefono: ['']
    });
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this.firestoreService.getCollection<Role>('Roles').subscribe(allRoles => {

      // filter roles: If the user doesn't have create permission, they only see RoleValue = 0
      const canCreateUsers = this.authService.userHasPermission('CrearUsuario') || this.authService.userHasPermission('CrearUsuarios');

      if (canCreateUsers) {
        this.roles = allRoles;
      } else {
        this.roles = allRoles.filter(r => +r.RoleValue === 0);
      }
    });
  }

  save() {
    if (this.userForm.valid) {
      const formValue = this.userForm.value;
      const newUser: User = {
        Nombre: formValue.Nombre,
        DocumentoDeIdentidad: formValue.DocumentoDeIdentidad,
        RoleId: formValue.RoleId,
        informacionContacto: {
          Celular: formValue.Celular,
          Email: formValue.Email,
          Direccion: formValue.Direccion ? formValue.Direccion.split(',').map((x: string) => x.trim()) : [],
          Telefono: formValue.Telefono
        }
      };

      this.firestoreService.addDoc('users', newUser).then(docRef => {
        this.alertsService.success('Usuario creado exitosamente');
        this.dialogRef.close(docRef.id);
      }).catch(error => {
        console.error(error);
        this.alertsService.error('Error al crear usuario');
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
