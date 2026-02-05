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
  templateUrl: './payment-dialog.component.html',
  styleUrl: './payment-dialog.component.scss',
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
