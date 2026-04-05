import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { firstValueFrom, map, Observable } from 'rxjs';
import { FirestoreService } from '../../services/firestore.service';
import { AlertsService } from '../../services/alerts.service';
import { Permission, Role } from '../../models/club-manager.models';

@Component({
  selector: 'app-permissions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PermissionsComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private alertsService = inject(AlertsService);
  private fb = inject(FormBuilder);

  permissions$: Observable<Permission[]> = new Observable<Permission[]>();
  displayedColumns: string[] = ['NombrePermiso', 'Acciones'];

  permissionForm: FormGroup;
  editingId: string | null = null;

  constructor() {
    this.permissionForm = this.fb.group({
      IdPermiso: [''],
      NombrePermiso: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.permissions$ = this.firestoreService.getCollection<Permission>('Permissions');
  }

  async savePermission(): Promise<void> {
    if (this.permissionForm.invalid) {
      this.permissionForm.markAllAsTouched();
      return;
    }

    const payload: Permission = this.permissionForm.value;

    try {
      if (this.editingId) {
        await this.firestoreService.updateDoc('Permissions', this.editingId, payload);
        this.alertsService.success('Permiso actualizado exitosamente');
      } else {
        await this.firestoreService.addDoc('Permissions', payload);
        this.alertsService.success('Permiso creado exitosamente');
        this.autoAddPermissionToAdmin();
      }
      this.cancelEdit();
    } catch (error) {
      this.alertsService.error('Ocurrió un error al guardar el permiso');
    }
  }

  editPermission(permission: Permission): void {
    this.editingId = permission.id ?? null;
    this.permissionForm.patchValue({
      IdPermiso: permission.id,
      NombrePermiso: permission.NombrePermiso
    });
  }

  cancelEdit(): void {
    this.editingId = null;
    this.permissionForm.reset();
  }

  async deletePermission(permission: Permission): Promise<void> {
    if (!permission.id) return;

    const confirmation = await this.alertsService.question('¿Estás seguro de que deseas eliminar este permiso?');
    if (confirmation.isConfirmed) {
      try {
        await this.firestoreService.deleteDoc('Permissions', permission.id);
        this.alertsService.success('Permiso eliminado exitosamente');
      } catch (error) {
        this.alertsService.error('No se pudo eliminar el permiso');
      }
    }
  }

  async autoAddPermissionToAdmin(): Promise<void> {
    try {
      // Tomamos la suscripción activa y obtenemos un único valor (un listado) de Firestore.

      const roles = await firstValueFrom(this.firestoreService.getCollection<Role>('Roles'));
      const adminRole = roles.find(role => role.RoleValue === 1);

      if (adminRole && adminRole.id) {

        const allPermissions = await firstValueFrom(this.firestoreService.getCollection<Permission>('Permissions'));
        await this.firestoreService.updateDoc('Roles', adminRole.id, { permissions: allPermissions });
      }
    } catch (error) {
      console.error('Error auto actualizando permisos del rol admin: ', error);
    }
  }

  searchPermission(searchValue: string): void {
    if (!searchValue) {
      this.permissions$ = this.firestoreService.getCollection<Permission>('Permissions');
      return;
    }
    this.permissions$ = this.firestoreService.getCollection<Permission>('Permissions').pipe(
      map((permissions: Permission[]) => permissions.filter(permission => permission.NombrePermiso.toLowerCase()
        .includes(searchValue.toLowerCase())))
    );
  }

}
