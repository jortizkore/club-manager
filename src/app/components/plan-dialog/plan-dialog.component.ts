import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-plan-dialog',
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
    <h2 mat-dialog-title>{{data.id ? 'Editar' : 'Nuevo'}} Plan</h2>
    <mat-dialog-content [formGroup]="form">
      <div class="form-row">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Descripción del Plan</mat-label>
          <input matInput formControlName="Descripcion" placeholder="Ej: Básico">
        </mat-form-field>
      </div>
      
      <div class="form-row">
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Monto Mensual</mat-label>
          <input matInput type="number" formControlName="MontoMensual" placeholder="Ej: 1000">
          <span matPrefix>$&nbsp;</span>
        </mat-form-field>
      </div>

      <div formGroupName="Detalles" class="details-container">
        <h3>Beneficios del Plan</h3>
        <mat-checkbox formControlName="Entrenamiento">Entrenamiento Incluido</mat-checkbox>
        <mat-checkbox formControlName="EntrenamientoPersonalizado">Entrenamiento Personalizado</mat-checkbox>
        <mat-checkbox formControlName="ExcursionesPagas">Excursiones Pagas</mat-checkbox>
        <mat-checkbox formControlName="Uniforme">Uniforme Incluido</mat-checkbox>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form-row { display: flex; gap: 16px; margin-bottom: 8px; }
    .full-width { width: 100%; }
    .details-container { display: grid; grid-template-columns: 1fr; gap: 8px; margin-top: 16px; }
    .details-container h3 { margin-bottom: 8px; font-size: 1rem; }
  `
})
export class PlanDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PlanDialogComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      id: [data.id],
      Descripcion: [data.Descripcion || '', Validators.required],
      MontoMensual: [data.MontoMensual || 0, [Validators.required, Validators.min(0)]],
      Detalles: this.fb.group({
        Entrenamiento: [data.Detalles?.Entrenamiento || false],
        EntrenamientoPersonalizado: [data.Detalles?.EntrenamientoPersonalizado || false],
        ExcursionesPagas: [data.Detalles?.ExcursionesPagas || false],
        Uniforme: [data.Detalles?.Uniforme || false]
      })
    });
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
