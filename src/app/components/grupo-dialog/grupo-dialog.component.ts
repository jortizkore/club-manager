import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-grupo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatButtonModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.id ? 'Editar' : 'Nuevo'}} Grupo</h2>
    <mat-dialog-content [formGroup]="form">
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Nombre del Grupo</mat-label>
          <input matInput formControlName="Grupo" placeholder="Ej: A">
        </mat-form-field>
      </div>
      
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>Descripción</mat-label>
        <textarea matInput formControlName="Descripcion" placeholder="Ej: Entrenamiento Básico"></textarea>
      </mat-form-field>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Hora Inicio</mat-label>
          <input matInput formControlName="HoraInicio" placeholder="Ej: 5 PM">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Hora Fin</mat-label>
          <input matInput formControlName="HoraFin" placeholder="Ej: 6:30 PM">
        </mat-form-field>
      </div>

      <div formGroupName="Dias" class="days-container">
        <h3>Días de Entrenamiento</h3>
        <mat-checkbox formControlName="Lunes">Lunes</mat-checkbox>
        <mat-checkbox formControlName="Martes">Martes</mat-checkbox>
        <mat-checkbox formControlName="Miercoles">Miércoles</mat-checkbox>
        <mat-checkbox formControlName="Jueves">Jueves</mat-checkbox>
        <mat-checkbox formControlName="Viernes">Viernes</mat-checkbox>
        <mat-checkbox formControlName="Sabado">Sábado</mat-checkbox>
        <mat-checkbox formControlName="Domingo">Domingo</mat-checkbox>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form-row { display: flex; gap: 16px; }
    .full-width { width: 100%; }
    .days-container { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 16px; }
    .days-container h3 { grid-column: 1 / span 2; margin-bottom: 8px; font-size: 1rem; }
  `
})
export class GrupoDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<GrupoDialogComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      id: [data.id],
      Grupo: [data.Grupo || '', Validators.required],
      Descripcion: [data.Descripcion || '', Validators.required],
      HoraInicio: [data.HoraInicio || '', Validators.required],
      HoraFin: [data.HoraFin || '', Validators.required],
      Dias: this.fb.group({
        Lunes: [data.Dias?.Lunes || false],
        Martes: [data.Dias?.Martes || false],
        Miercoles: [data.Dias?.Miercoles || false],
        Jueves: [data.Dias?.Jueves || false],
        Viernes: [data.Dias?.Viernes || false],
        Sabado: [data.Dias?.Sabado || false],
        Domingo: [data.Dias?.Domingo || false]
      })
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
