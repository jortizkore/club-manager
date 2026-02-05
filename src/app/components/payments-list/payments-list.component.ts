import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { FirestoreService } from '../../services/firestore.service';
import { Pago, Prospect } from '../../models/club-manager.models';
import { PaymentDialogComponent } from '../payment-dialog/payment-dialog.component';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-payments-list',
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
        <h1 class="mat-h1">Registro de Pagos</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>add_payment</mat-icon> Registrar Pago
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="(payments$ | async) || []" class="mat-elevation-z8">
          <ng-container matColumnDef="Prospecto">
            <th mat-header-cell *matHeaderCellDef> Socio / Prospecto </th>
            <td mat-cell *matCellDef="let element"> {{element.prospectName}} </td>
          </ng-container>

          <ng-container matColumnDef="Mes">
            <th mat-header-cell *matHeaderCellDef> Mes </th>
            <td mat-cell *matCellDef="let element"> {{element.MesPago}} </td>
          </ng-container>

          <ng-container matColumnDef="Monto">
            <th mat-header-cell *matHeaderCellDef> Monto </th>
            <td mat-cell *matCellDef="let element"> {{element.montoPago | currency}} </td>
          </ng-container>

          <ng-container matColumnDef="Fecha">
            <th mat-header-cell *matHeaderCellDef> Fecha </th>
            <td mat-cell *matCellDef="let element"> {{element.fechaPago}} </td>
          </ng-container>

          <ng-container matColumnDef="Estado">
            <th mat-header-cell *matHeaderCellDef> Estatus </th>
            <td mat-cell *matCellDef="let element">
               <span class="status-badge" [class.completed]="element.Completado">
                {{element.Completado ? 'Completado' : 'Pendiente'}}
               </span>
            </td>
          </ng-container>

          <ng-container matColumnDef="Acciones">
            <th mat-header-cell *matHeaderCellDef> Acciones </th>
            <td mat-cell *matCellDef="let element">
              <button mat-icon-button color="accent" (click)="openDialog(element)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deletePayment(element.id)">
                <mat-icon>delete</mat-icon>
              </button>
              <a mat-icon-button *ngIf="element.Evidencia" [href]="element.Evidencia" target="_blank" color="primary">
                <mat-icon>visibility</mat-icon>
              </a>
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
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 0.75rem; background: #ffebee; color: #c62828; }
    .status-badge.completed { background: #e8f5e9; color: #2e7d32; }
  `
})
export class PaymentsListComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private dialog = inject(MatDialog);

  payments$: Observable<any[]> = new Observable<any[]>();
  displayedColumns: string[] = ['Prospecto', 'Mes', 'Monto', 'Fecha', 'Estado', 'Acciones'];

  ngOnInit() {
    this.loadPayments();
  }

  loadPayments() {
    this.payments$ = this.firestoreService.getCollection<Pago>('Pagos').pipe(
      switchMap(payments => {
        if (payments.length === 0) return of([]);
        return this.firestoreService.getCollection<Prospect>('prospect').pipe(
          map(prospects => {
            return payments.map(p => ({
              ...p,
              prospectName: prospects.find(pr => pr.id === p.prospectUID)?.Nombre + ' ' + (prospects.find(pr => pr.id === p.prospectUID)?.ApellidoPaterno || '') || ''
            }));
          })
        );
      }),
      catchError(err => {
        console.error('Error loading payments', err);
        return of([]);
      })
    );
  }

  openDialog(payment?: Pago): void {
    const dialogRef = this.dialog.open(PaymentDialogComponent, {
      width: '600px',
      data: payment ? { ...payment } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.firestoreService.updateDoc('Pagos', result.id, result);
        } else {
          this.firestoreService.addDoc('Pagos', result);
        }
      }
    });
  }

  deletePayment(id: string): void {
    if (confirm('¿Está seguro de eliminar este registro de pago?')) {
      this.firestoreService.deleteDoc('Pagos', id);
    }
  }
}
