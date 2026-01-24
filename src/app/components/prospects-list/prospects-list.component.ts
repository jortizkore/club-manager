import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../../services/firestore.service';
import { Prospect } from '../../models/club-manager.models';
import { ProspectDialogComponent } from '../prospect-dialog/prospect-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-prospects-list',
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
        <h1 class="mat-h1">Análisis de Prospectos</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>person_add</mat-icon> Nuevo Prospecto
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="(prospects$ | async) || []" class="mat-elevation-z8">
          <ng-container matColumnDef="Nombre">
            <th mat-header-cell *thCellDef> Nombre </th>
            <td mat-cell *tdCellDef="let element"> {{element.Nombre}} {{element.Apellido}} </td>
          </ng-container>

          <ng-container matColumnDef="Contacto">
            <th mat-header-cell *thCellDef> Contacto </th>
            <td mat-cell *tdCellDef="let element"> 
              <div class="contact-info">
                <span><mat-icon small>phone</mat-icon> {{element.Telefono}}</span>
                <span><mat-icon small>email</mat-icon> {{element.Email}}</span>
              </div>
            </td>
          </ng-container>

          <ng-container matColumnDef="Interes">
            <th mat-header-cell *thCellDef> Interés </th>
            <td mat-cell *tdCellDef="let element"> {{element.Interes}} </td>
          </ng-container>

          <ng-container matColumnDef="Status">
            <th mat-header-cell *thCellDef> Estatus </th>
            <td mat-cell *tdCellDef="let element">
              <span class="status-badge" [ngClass]="element.Status?.toLowerCase()">
                {{element.Status}}
              </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="Acciones">
            <th mat-header-cell *thCellDef> Acciones </th>
            <td mat-cell *tdCellDef="let element">
              <button mat-icon-button color="accent" (click)="openDialog(element)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteProspect(element.id)">
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
    .contact-info { display: flex; flex-direction: column; font-size: 0.85rem; }
    .contact-info mat-icon { font-size: 14px; width: 14px; height: 14px; vertical-align: middle; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; text-transform: uppercase; font-weight: bold; }
    .nuevo { background: #e3f2fd; color: #1976d2; }
    .contactado { background: #f3e5f5; color: #7b1fa2; }
    .interesado { background: #e8f5e9; color: #388e3c; }
    .convertido { background: #fff3e0; color: #f57c00; }
  `
})
export class ProspectsListComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private dialog = inject(MatDialog);

  prospects$: Observable<Prospect[]> = new Observable<Prospect[]>();
  displayedColumns: string[] = ['Nombre', 'Contacto', 'Interes', 'Status', 'Acciones'];

  ngOnInit() {
    this.prospects$ = this.firestoreService.getCollection<Prospect>('prospect');
  }

  openDialog(prospect?: Prospect): void {
    const dialogRef = this.dialog.open(ProspectDialogComponent, {
      width: '600px',
      data: prospect ? { ...prospect } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.firestoreService.updateDoc('prospect', result.id, result);
        } else {
          result.FechaIngreso = new Date().toISOString().split('T')[0];
          this.firestoreService.addDoc('prospect', result);
        }
      }
    });
  }

  deleteProspect(id: string): void {
    if (confirm('¿Está seguro de eliminar este prospecto?')) {
      this.firestoreService.deleteDoc('prospect', id);
    }
  }
}
