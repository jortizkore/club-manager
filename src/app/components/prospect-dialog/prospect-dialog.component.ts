import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-prospect-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.id ? 'Editar' : 'Nuevo'}} Prospecto</h2>
    <mat-dialog-content [formGroup]="form">
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Nombre</mat-label>
          <input matInput formControlName="Nombre">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Apellido</mat-label>
          <input matInput formControlName="Apellido">
        </mat-form-field>
      </div>
      
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Teléfono</mat-label>
          <input matInput formControlName="Telefono">
          <mat-icon matSuffix>phone</mat-icon>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input matInput formControlName="Email" type="email">
          <mat-icon matSuffix>email</mat-icon>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Interés</mat-label>
          <mat-select formControlName="Interes">
            <mat-option value="Pesas">Pesas</mat-option>
            <mat-option value="Cardio">Cardio</mat-option>
            <mat-option value="Crossfit">Crossfit</mat-option>
            <mat-option value="Yoga">Yoga</mat-option>
          </mat-select>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Estatus</mat-label>
          <mat-select formControlName="Status">
            <mat-option value="Nuevo">Nuevo</mat-option>
            <mat-option value="Contactado">Contactado</mat-option>
            <mat-option value="Interesado">Interesado</mat-option>
            <mat-option value="Convertido">Convertido</mat-option>
          </mat-select>
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form-row { display: flex; gap: 16px; margin-bottom: 8px; }
    mat-form-field { flex: 1; }
  `
})
export class ProspectDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProspectDialogComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      id: [data.id],
      Nombre: [data.Nombre || '', Validators.required],
      Apellido: [data.Apellido || '', Validators.required],
      Telefono: [data.Telefono || '', Validators.required],
      Email: [data.Email || '', [Validators.required, Validators.email]],
      Interes: [data.Interes || 'Pesas', Validators.required],
      Status: [data.Status || 'Nuevo', Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
