import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Prospect } from '../../models/club-manager.models';
import { FirestoreService } from '../../services/firestore.service';

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
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './prospect-dialog.component.html',
  styleUrl: './prospect-dialog.component.scss',
})
export class ProspectDialogComponent {
  private fb = inject(FormBuilder);
  private firestoreService = inject(FirestoreService);
  private dialogRef = inject(MatDialogRef<ProspectDialogComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: Prospect) {
    this.form = this.fb.group({
      id: [data.id],
      Nombre: [data.Nombre || '', Validators.required],
      Nombre2: [data.Nombre2 || ''],
      ApellidoPaterno: [data.ApellidoPaterno || '', Validators.required],
      ApellidoMaterno: [data.ApellidoMaterno || ''],
      Telefono: [data.Telefono || '', Validators.required],
      Email: [data.Email || '', [Validators.required, Validators.email]],
      Status: [data.Status || false, Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      debugger;
      const prospect: Prospect = this.form.value;
      this.firestoreService.addDoc('prospect', prospect);
      this.dialogRef.close(this.form.value);
    }
  }
}
