import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../../services/firestore.service';
import { Plan } from '../../models/club-manager.models';
import { PlanDialogComponent } from '../plan-dialog/plan-dialog.component';
import { Observable } from 'rxjs';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-planes-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule
  ],
  templateUrl: './planes-list.component.html',
  styleUrl: './planes-list.component.scss'
})
export class PlanesListComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private dialog = inject(MatDialog);
  private alertsService = inject(AlertsService);

  planes$: Observable<Plan[]> = new Observable<Plan[]>();
  displayedColumns: string[] = ['Descripcion', 'Monto', 'Entrenamiento', 'Acciones'];

  ngOnInit() {
    this.planes$ = this.firestoreService.getCollection<Plan>('Planes');
  }

  openDialog(plan?: Plan): void {
    const dialogRef = this.dialog.open(PlanDialogComponent, {
      width: '500px',
      data: plan ? { ...plan } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.firestoreService.updateDoc('Planes', result.id, result);
        } else {
          this.firestoreService.addDoc('Planes', result);
        }
      }
    });
  }

  deletePlan(id: string): void {
    this.alertsService.question('¿Está seguro de eliminar este plan?').then(result => {
      if (result.isConfirmed) {
        this.firestoreService.deleteDoc('Planes', id);
      } else {
        this.alertsService.info('Plan no eliminado');
      }
    });
  }
}
