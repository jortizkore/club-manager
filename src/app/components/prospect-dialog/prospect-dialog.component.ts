import { Component, Inject, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { FormProspect, Prospect } from '../../models/club-manager.models';

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
    MatIconModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './prospect-dialog.component.html',
  styleUrl: './prospect-dialog.component.scss',
})
export class ProspectDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ProspectDialogComponent>);

  form: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: FormProspect) {
    this.form = this.fb.group({
      id: [data.id],
      Nombre: [data.Nombre || '', Validators.required],
      Nombre2: [data.Nombre2 || ''],
      ApellidoPaterno: [data.ApellidoPaterno || '', Validators.required],
      ApellidoMaterno: [data.ApellidoMaterno || ''],
      Celular: [data.Celular || '',],
      Email: [data.Email || '', [Validators.email]],
      FechaNacimiento: [data.FechaNacimiento || "", Validators.required]
    });
  }

  save() {
    if (this.form.valid) {
      const ProspectToSave: Prospect = {
        Nombre: {
          Nombre: this.form.value.Nombre,
          Nombre2: this.form.value.Nombre2,
          ApellidoPaterno: this.form.value.ApellidoPaterno,
          ApellidoMaterno: this.form.value.ApellidoMaterno
        },
        Celular: this.form.value.Celular,
        Email: this.form.value.Email,
        EstadoDeSubscripcion: false,
        FechaNacimiento: this.form.value.FechaNacimiento,
        Analisis: [],
        TutorUID: ""

      };
      this.dialogRef.close(ProspectToSave);
    }
  }
}
