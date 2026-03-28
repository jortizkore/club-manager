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
import { AlertsService } from '../../services/alerts.service';

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
  templateUrl: './payments-list.component.html',
  styleUrl: './payments-list.component.scss'
})
export class PaymentsListComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private dialog = inject(MatDialog);
  private alertsService = inject(AlertsService);

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
              prospectName: prospects.find(pr => pr.id === p.prospectUID)?.Nombre.Nombre + ' ' + (prospects.find(pr => pr.id === p.prospectUID)?.Nombre.ApellidoPaterno || '') || ''
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
    this.alertsService.question('¿Está seguro de eliminar este registro de pago?').then(result => {
      if (result.isConfirmed) {
        this.firestoreService.deleteDoc('Pagos', id);
      } else {
        this.alertsService.info('Registro de pago no eliminado');
      }
    });
  }
}
