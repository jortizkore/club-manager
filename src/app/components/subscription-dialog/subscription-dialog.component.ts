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
  templateUrl: './subscription-dialog.component.html',
  styleUrl: './subscription-dialog.component.scss',
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
        Activo: [data.Estado?.Activo || false],
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
