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
  template: `
    <div class="content-container">
      <div class="header">
        <h1 class="mat-h1">Gestión de Planes</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Nuevo Plan
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="(planes$ | async) || []" class="mat-elevation-z8">
          <ng-container matColumnDef="Descripcion">
            <th mat-header-cell *thCellDef> Descripción </th>
            <td mat-cell *tdCellDef="let element"> {{element.Descripcion}} </td>
          </ng-container>

          <ng-container matColumnDef="Monto">
            <th mat-header-cell *thCellDef> Monto Mensual </th>
            <td mat-cell *tdCellDef="let element"> {{element.MontoMensual | currency}} </td>
          </ng-container>

          <ng-container matColumnDef="Entrenamiento">
            <th mat-header-cell *thCellDef> Entrenamiento </th>
            <td mat-cell *tdCellDef="let element">
              <mat-icon [color]="element.Detalles?.Entrenamiento ? 'primary' : 'warn'">
                {{element.Detalles?.Entrenamiento ? 'check_circle' : 'cancel'}}
              </mat-icon>
            </td>
          </ng-container>

          <ng-container matColumnDef="Acciones">
            <th mat-header-cell *thCellDef> Acciones </th>
            <td mat-cell *tdCellDef="let element">
              <button mat-icon-button color="accent" (click)="openDialog(element)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deletePlan(element.id)">
                <mat-icon>delete</mat-icon>
              </button>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: `
    .content-container { padding: 0; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
    table { width: 100%; }
  `
})
export class PlanesListComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private dialog = inject(MatDialog);

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
    if (confirm('¿Está seguro de eliminar este plan?')) {
      this.firestoreService.deleteDoc('Planes', id);
    }
  }
}
