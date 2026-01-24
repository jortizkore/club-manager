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
  templateUrl: './prospects-list.component.html',
  styleUrls: ['./prospects-list.component.scss']
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
