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
import { Observable, Subscription } from 'rxjs';
import { AlertsService } from '../../services/alerts.service';

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
  templateUrl: './prospects-list.component.html',
  styleUrls: ['./prospects-list.component.scss']
})
export class ProspectsListComponent implements OnInit {
  private firestoreService = inject(FirestoreService);
  private dialog = inject(MatDialog);
  private alertsService = inject(AlertsService);
  private subs: Subscription[] = [];

  //prospects$: Observable<Prospect[]> = new Observable<Prospect[]>();
  prospects: Prospect[] = [];
  displayedColumns: string[] = ['Nombre', 'Contacto', 'Interes', 'Status', 'Acciones'];

  ngOnInit() {
    //this.prospects$ = this.firestoreService.getCollection<Prospect>('prospect');
    debugger;
    this.subs.push(this.firestoreService.getCollection<Prospect>('prospect')
      .subscribe(_prospects => {
        console.log('prospects', _prospects);
        this.prospects = _prospects;
      })
    );
  }

  openDialog(prospect?: Prospect): void {
    const dialogRef = this.dialog.open(ProspectDialogComponent, {
      width: '600px',
      data: prospect ? { ...prospect } : {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.id) {
          debugger;
          this.firestoreService.updateDoc('prospect', result.id, result).then(() => {
            this.alertsService.success('Prospecto actualizado correctamente');
          }).catch((error) => {
            this.alertsService.error('Error al actualizar el prospecto: ');
            console.error(error);
          });

        } else {
          result.FechaNacimiento = new Date().toISOString().split('T')[0];
          this.firestoreService.addDoc('prospect', result).then(() => {
            this.alertsService.success('Prospecto agregado correctamente');
          }).catch((error) => {
            this.alertsService.error('Error al agregar el prospecto: ');
            console.error(error);
          });
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
