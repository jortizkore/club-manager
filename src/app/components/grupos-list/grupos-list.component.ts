import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FirestoreService } from '../../services/firestore.service';
import { Grupo } from '../../models/club-manager.models';
import { GrupoDialogComponent } from '../grupo-dialog/grupo-dialog.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-grupos-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule
  ],
  template: `
    <div class="content-container">
      <div class="header">
        <h1 class="mat-h1">Gestión de Grupos</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add</mat-icon> Nuevo Grupo
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="(grupos$ | async) || []" class="mat-elevation-z8">
          <ng-container matColumnDef="Grupo">
            <th mat-header-cell *thCellDef> Grupo </th>
            <td mat-cell *tdCellDef="let element"> {{element.Grupo}} </td>
          </ng-container>

          <ng-container matColumnDef="Descripcion">
            <th mat-header-cell *thCellDef> Descripción </th>
            <td mat-cell *tdCellDef="let element"> {{element.Descripcion}} </td>
          </ng-container>

          <ng-container matColumnDef="Horario">
            <th mat-header-cell *thCellDef> Horario </th>
            <td mat-cell *tdCellDef="let element"> {{element.HoraInicio}} - {{element.HoraFin}} </td>
          </ng-container>

          <ng-container matColumnDef="Acciones">
            <th mat-header-cell *thCellDef> Acciones </th>
            <td mat-cell *tdCellDef="let element">
              <button mat-icon-button color="accent" (click)="openDialog(element)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteGrupo(element.id)">
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
export class GruposListComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private dialog = inject(MatDialog);

  grupos$: Observable<Grupo[]> = new Observable<Grupo[]>();
  displayedColumns: string[] = ['Grupo', 'Descripcion', 'Horario', 'Acciones'];

  ngOnInit() {
    this.grupos$ = this.firestoreService.getCollection<Grupo>('Grupos');
  }

  openDialog(grupo?: Grupo): void {
    const dialogRef = this.dialog.open(GrupoDialogComponent, {
      width: '500px',
      data: grupo ? { ...grupo } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.firestoreService.updateDoc('Grupos', result.id, result);
        } else {
          this.firestoreService.addDoc('Grupos', result);
        }
      }
    });
  }

  deleteGrupo(id: string): void {
    if (confirm('¿Está seguro de eliminar este grupo?')) {
      this.firestoreService.deleteDoc('Grupos', id);
    }
  }
}
