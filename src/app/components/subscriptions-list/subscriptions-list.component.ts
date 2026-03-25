import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { FirestoreService } from '../../services/firestore.service';
import { Prospect, Plan, Subscripcion } from '../../models/club-manager.models';
import { Subscription } from 'rxjs';
import { SubscriptionDialogComponent } from '../subscription-dialog/subscription-dialog.component';
import { Observable, forkJoin, of, combineLatest } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { AlertsService } from '../../services/alerts.service';

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
  templateUrl: './subscriptions-list.component.html',
  styleUrl: './subscription-list.component.scss',
})
export class SubscriptionsListComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private dialog = inject(MatDialog);
  private alertsService = inject(AlertsService);
  subscriptionList: Subscripcion[] = [];
  subscriptionListToDisplay: SubscripcionItem[] = [];
  subs: Subscription[] = [];
  displayedColumns: string[] = ['Prospecto', 'Plan', 'Estado', 'Acciones'];

  ngOnInit() {
    this.loadSubscriptions();
  }

  loadSubscriptions() {
    this.subs.push(
      combineLatest({
        _subs: this.firestoreService.getCollection<Subscripcion>('Subscripciones'),
        prospects: this.firestoreService.getCollection<Prospect>('prospect'),
        plans: this.firestoreService.getCollection<Plan>('Planes')
      }).pipe(
        map(({ _subs, prospects, plans }) => {
          this.subscriptionListToDisplay = _subs.map(sub => ({
            ...sub,
            prospectName: prospects.find(p => p.id === sub.prospectUID)?.Nombre.Nombre || '-',
            planName: plans.find(p => p.id === sub.PlanUID)?.Descripcion || '-'
          }));
        }),
        catchError(error => {
          this.alertsService.error('Error al cargar las membresías: ' + error.message);
          console.error(error);
          return of(null);
        })
      ).subscribe()
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
    this.alertsService.question('¿Está seguro de eliminar esta membresía?').then(result => {
      if (result.isConfirmed) {
        this.firestoreService.deleteDoc('Subscripciones', id);
      } else {
        this.alertsService.info('Membresía no eliminada');
      }
    });
  }
}

interface SubscripcionItem {
  id?: string;
  PlanUID: string;
  prospectUID: string;
  Estado: {
    Activo: boolean;
    Cancelado: boolean;
    PendientePago: boolean;
    Suspendido: boolean;
  };
  Observaciones: string[];
  prospectName: string;
  planName: string;
}