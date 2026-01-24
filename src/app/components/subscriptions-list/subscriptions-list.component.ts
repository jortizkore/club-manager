import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FirestoreService } from '../../services/firestore.service';
import { Subscripcion, Prospect, Plan } from '../../models/club-manager.models';
import { SubscriptionDialogComponent } from '../subscription-dialog/subscription-dialog.component';
import { Observable, forkJoin, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-subscriptions-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule
  ],
  template: `
    <div class="content-container">
      <div class="header">
        <h1 class="mat-h1">Gestión de Membresías</h1>
        <button mat-raised-button color="primary" (click)="openDialog()">
          <mat-icon>card_membership</mat-icon> Nueva Membresía
        </button>
      </div>

      <mat-card>
        <table mat-table [dataSource]="(subscriptions$ | async) || []" class="mat-elevation-z8">
          <ng-container matColumnDef="Prospecto">
            <th mat-header-cell *thCellDef> Prospecto </th>
            <td mat-cell *tdCellDef="let element"> {{element.prospectName}} </td>
          </ng-container>

          <ng-container matColumnDef="Plan">
            <th mat-header-cell *thCellDef> Plan </th>
            <td mat-cell *tdCellDef="let element"> {{element.planName}} </td>
          </ng-container>

          <ng-container matColumnDef="Estado">
            <th mat-header-cell *thCellDef> Estado </th>
            <td mat-cell *tdCellDef="let element">
              <mat-chip-listbox>
                <mat-chip *ngIf="element.Estado?.Activo" color="primary" selected>Activo</mat-chip>
                <mat-chip *ngIf="element.Estado?.PendientePago" color="accent" selected>Pendiente</mat-chip>
                <mat-chip *ngIf="element.Estado?.Suspendido" color="warn" selected>Suspendido</mat-chip>
                <mat-chip *ngIf="element.Estado?.Cancelado">Cancelado</mat-chip>
              </mat-chip-listbox>
            </td>
          </ng-container>

          <ng-container matColumnDef="Acciones">
            <th mat-header-cell *thCellDef> Acciones </th>
            <td mat-cell *tdCellDef="let element">
              <button mat-icon-button color="accent" (click)="openDialog(element)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteSubscription(element.id)">
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
export class SubscriptionsListComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private dialog = inject(MatDialog);

  subscriptions$: Observable<any[]> = new Observable<any[]>();
  displayedColumns: string[] = ['Prospecto', 'Plan', 'Estado', 'Acciones'];

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subscriptions$ = this.firestoreService.getCollection<Subscripcion>('Subscripciones').pipe(
      switchMap(subs => {
        if (subs.length === 0) return of([]);
        return forkJoin([
          this.firestoreService.getCollection<Prospect>('prospect'),
          this.firestoreService.getCollection<Plan>('Planes')
        ]).pipe(
          map(([prospects, plans]) => {
            return subs.map(sub => ({
              ...sub,
              prospectName: prospects.find(p => p.id === sub.prospectUID)?.Nombre + ' ' + (prospects.find(p => p.id === sub.prospectUID)?.Apellido || '') || 'N/A',
              planName: plans.find(p => p.id === sub.PlanUID)?.Descripcion || 'N/A'
            }));
          })
        );
      }),
      catchError(err => {
        console.error('Error loading subscriptions', err);
        return of([]);
      })
    );
  }

  openDialog(sub?: Subscripcion): void {
    const dialogRef = this.dialog.open(SubscriptionDialogComponent, {
      width: '600px',
      data: sub ? { ...sub } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          this.firestoreService.updateDoc('Subscripciones', result.id, result);
        } else {
          this.firestoreService.addDoc('Subscripciones', result);
        }
      }
    });
  }

  deleteSubscription(id: string): void {
    if (confirm('¿Está seguro de eliminar esta membresía?')) {
      this.firestoreService.deleteDoc('Subscripciones', id);
    }
  }
}
