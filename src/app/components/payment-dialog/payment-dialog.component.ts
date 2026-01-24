import { Component, Inject, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FirestoreService } from '../../services/firestore.service';
import { StorageService } from '../../services/storage.service';
import { Prospect } from '../../models/club-manager.models';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-payment-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule
  ],
  template: `
    <h2 mat-dialog-title>{{data.id ? 'Editar' : 'Registrar'}} Pago</h2>
    <mat-dialog-content [formGroup]="form">
      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Socio / Prospecto</mat-label>
          <mat-select formControlName="prospectUID">
            <mat-option *ngFor="let p of prospects$ | async" [value]="p.id">
              {{p.Nombre}} {{p.Apellido}}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Mes de Pago</mat-label>
          <input matInput formControlName="MesPago" placeholder="Ej: Enero 2025">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Monto</mat-label>
          <input matInput type="number" formControlName="montoPago">
          <span matPrefix>$&nbsp;</span>
        </mat-form-field>
      </div>

      <div class="form-row">
        <mat-form-field appearance="outline">
          <mat-label>Fecha de Pago</mat-label>
          <input matInput type="date" formControlName="fechaPago">
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>Método de Pago</mat-label>
          <mat-select formControlName="MetodoDePago">
            <mat-option value="Efectivo">Efectivo</mat-option>
            <mat-option value="Transferencia">Transferencia</mat-option>
            <mat-option value="Tarjeta">Tarjeta</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="upload-section">
        <h3>Evidencia de Pago</h3>
        <input type="file" #fileInput (change)="onFileSelected($event)" accept="image/*" style="display: none;">
        <div class="upload-controls">
          <button mat-stroked-button type="button" (click)="fileInput.click()" [disabled]="uploading">
            <mat-icon>upload_file</mat-icon> {{form.get('Evidencia')?.value ? 'Cambiar Imagen' : 'Subir Imagen'}}
          </button>
          <span class="file-status" *ngIf="uploading">Subiendo...</span>
          <mat-icon color="primary" *ngIf="form.get('Evidencia')?.value && !uploading">check_circle</mat-icon>
        </div>
        <mat-progress-bar mode="indeterminate" *ngIf="uploading"></mat-progress-bar>
        <div class="preview" *ngIf="form.get('Evidencia')?.value">
          <img [src]="form.get('Evidencia')?.value" alt="Evidencia">
        </div>
      </div>

      <div class="status-row">
        <mat-checkbox formControlName="Completado">Pago Completado / Verificado</mat-checkbox>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-raised-button color="primary" [disabled]="form.invalid || uploading" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: `
    .form-row { display: flex; gap: 16px; margin-bottom: 8px; }
    mat-form-field { flex: 1; }
    .upload-section { margin: 16px 0; padding: 16px; border: 1px dashed #ccc; border-radius: 8px; }
    .upload-controls { display: flex; align-items: center; gap: 16px; margin-bottom: 8px; }
    .preview { margin-top: 12px; max-height: 200px; overflow: hidden; border-radius: 4px; }
    .preview img { width: 100%; height: auto; display: block; }
    .status-row { margin-top: 16px; }
  `
})
export class PaymentDialogComponent implements OnInit {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<PaymentDialogComponent>);
  private firestoreService = inject(FirestoreService);
  private storageService = inject(StorageService);

  form: FormGroup;
  prospects$: Observable<Prospect[]> = new Observable<Prospect[]>();
  uploading = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.form = this.fb.group({
      id: [data.id],
      prospectUID: [data.prospectUID || '', Validators.required],
      MesPago: [data.MesPago || '', Validators.required],
      montoPago: [data.montoPago || 0, [Validators.required, Validators.min(0)]],
      fechaPago: [data.fechaPago || new Date().toISOString().split('T')[0], Validators.required],
      MetodoDePago: [data.MetodoDePago || 'Efectivo', Validators.required],
      Evidencia: [data.Evidencia || ''],
      Completado: [data.Completado || false]
    });
  }

  ngOnInit() {
    this.prospects$ = this.firestoreService.getCollection<Prospect>('prospect');
  }

  async onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.uploading = true;
      try {
        const path = `evidencias/${Date.now()}_${file.name}`;
        const url = await this.storageService.uploadFile(path, file);
        this.form.get('Evidencia')?.setValue(url);
      } catch (error) {
        console.error('Error uploading file', error);
      } finally {
        this.uploading = false;
      }
    }
  }

  save() {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
