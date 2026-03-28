import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { Observable } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { AlertsService } from '../../services/alerts.service';
import { Permission, Role } from '../../models/club-manager.models';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RolesComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private alertsService = inject(AlertsService);
  private fb = inject(FormBuilder);

  roles$: Observable<Role[]> = new Observable<Role[]>();
  permissions$: Observable<Permission[]> = new Observable<Permission[]>();
  displayedColumns: string[] = ['RoleValue', 'RoleDescription', 'Acciones'];

  roleForm: FormGroup;
  editingRoleId: string | null = null;
  selectedPermissions: Permission[] = [];

  constructor() {
    this.roleForm = this.fb.group({
      RoleID: [''],
      RoleValue: ['', Validators.required],
      RoleDescription: ['', Validators.required],
      permissions: [[]]
    });
  }

  ngOnInit(): void {
    this.roles$ = this.firestoreService.getCollection<Role>('Roles');
    this.permissions$ = this.firestoreService.getCollection<Permission>('Permissions');
  }

  async saveRole(): Promise<void> {
    if (this.roleForm.invalid) {
      this.roleForm.markAllAsTouched();
      return;
    }

    const payload: Role = this.roleForm.value;

    try {
      if (this.editingRoleId) {
        await this.firestoreService.updateDoc('Roles', this.editingRoleId, payload);
        this.alertsService.success('Rol actualizado exitosamente');
      } else {
        await this.firestoreService.addDoc('Roles', payload);
        this.alertsService.success('Rol creado exitosamente');
      }
      this.cancelEdit();
    } catch (error) {
      this.alertsService.error('Ocurrió un error al guardar el rol');
    }
  }

  editRole(role: Role): void {
    this.editingRoleId = role.id ?? null;
    this.roleForm.patchValue({
      RoleID: role.id,
      RoleValue: role.RoleValue,
      RoleDescription: role.RoleDescription,
      permissions: role.permissions
    });
    this.selectedPermissions = role.permissions;
  }

  cancelEdit(): void {
    this.editingRoleId = null;
    this.roleForm.reset();
  }

  async deleteRole(role: Role): Promise<void> {
    if (!role.id) return;

    const confirmation = await this.alertsService.question('¿Estás seguro de que deseas eliminar este rol?');
    if (confirmation.isConfirmed) {
      try {
        await this.firestoreService.deleteDoc('Roles', role.id);
        this.alertsService.success('Rol eliminado exitosamente');
      } catch (error) {
        this.alertsService.error('No se pudo eliminar el rol');
      }
    }
  }
}
