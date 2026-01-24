import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { FirestoreService } from '../../services/firestore.service';
import { Prospect, Plan } from '../../models/club-manager.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-subscription-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatChipsModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.id ? 'Editar' : 'Nueva'}} Membresía</h2>
    <mat-dialog-content [formGroup]="form">
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Prospecto / Miembro</mat-label>
          <mat-select formControlName="prospectUID">
            <mat-option *ngFor="let p of prospects$ | async" [value]="p.id">
              {{p.Nombre}} {{p.Apellido}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Plan</mat-label>
          <mat-select formControlName="PlanUID">
            <mat-option *ngFor="let p of plans$ | async" [value]="p.id">
              {{p.Descripcion}} ({{p.MontoMensual | currency}})
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div formGroupName="Estado" class="estado-container">
        <h3>Estado de la Membresía</h3>
        <div class="chips-grid">
          <mat-checkbox formControlName="Activo">Activo</mat-checkbox>
          <mat-checkbox formControlName="PendientePago">Pendiente de Pago</mat-checkbox>
          <mat-checkbox formControlName="Suspendido">Suspendido</mat-checkbox>
          <mat-checkbox formControlName="Cancelado">Cancelado</mat-checkbox>
        </div>
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
    .estado-container { margin-top: 16px; }
    .chips-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
  `
})
export class SubscriptionDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<SubscriptionDialogComponent>);
  private firestoreService = inject(FirestoreService);

  form: FormGroup;
  prospects$: Observable<Prospect[]> = new Observable<Prospect[]>();
  plans$: Observable<Plan[]> = new Observable<Plan[]>();

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      id: [data.id],
      prospectUID: [data.prospectUID || '', Validators.required],
      PlanUID: [data.PlanUID || '', Validators.required],
      Estado: this.fb.group({
        Activo: [data.Estado?.Activo || true],
        PendientePago: [data.Estado?.PendientePago || false],
        Suspendido: [data.Estado?.Suspendido || false],
        Cancelado: [data.Estado?.Cancelado || false]
      }),
      Observaciones: [data.Observaciones || []]
    });
  }

  ngOnInit() {
    this.prospects$ = this.firestoreService.getCollection<Prospect>('prospect');
    this.plans$ = this.firestoreService.getCollection<Plan>('Planes');
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
