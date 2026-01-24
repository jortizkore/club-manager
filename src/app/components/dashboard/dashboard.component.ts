import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatIconModule,
    MatGridListModule
  ],
  template: `
    <div class="dashboard-container">
      <h1 class="mat-h1">Dashboard - Club Manager</h1>
      
      <mat-grid-list cols="4" rowHeight="160px" gutterSize="24px">
        <mat-grid-tile>
          <mat-card class="stats-card prospectos">
            <mat-card-header>
              <mat-card-title>Prospectos</mat-card-title>
              <mat-icon mat-card-avatar>person_search</mat-icon>
            </mat-card-header>
            <mat-card-content>
              <div class="value">24</div>
              <div class="label">Nuevos este mes</div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stats-card miembros">
            <mat-card-header>
              <mat-card-title>Miembros</mat-card-title>
              <mat-icon mat-card-avatar>group</mat-icon>
            </mat-card-header>
            <mat-card-content>
              <div class="value">156</div>
              <div class="label">Activos hoy</div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stats-card pagos">
            <mat-card-header>
              <mat-card-title>Ingresos</mat-card-title>
              <mat-icon mat-card-avatar>monetization_on</mat-icon>
            </mat-card-header>
            <mat-card-content>
              <div class="value">$12,450</div>
              <div class="label">Enero 2025</div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>

        <mat-grid-tile>
          <mat-card class="stats-card alertas">
            <mat-card-header>
              <mat-card-title>Pendientes</mat-card-title>
              <mat-icon mat-card-avatar>warning</mat-icon>
            </mat-card-header>
            <mat-card-content>
              <div class="value">8</div>
              <div class="label">Pagos vencidos</div>
            </mat-card-content>
          </mat-card>
        </mat-grid-tile>
      </mat-grid-list>

      <div class="recent-activity">
        <h2 class="mat-h2">Actividad Reciente</h2>
        <mat-card>
          <mat-card-content>
            <p>Sección de análisis de datos y gráficos próximamente...</p>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: `
    .dashboard-container {
      padding: 0;
    }
    .stats-card {
      width: 100%;
      height: 100%;
      border-radius: 12px;
      transition: transform 0.2s;
      cursor: pointer;
    }
    .stats-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    }
    .mat-card-header {
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .value {
      font-size: 2.5rem;
      font-weight: bold;
      color: #333;
    }
    .label {
      color: #666;
      font-size: 0.9rem;
    }
    .prospectos { border-left: 5px solid #2196F3; }
    .miembros { border-left: 5px solid #4CAF50; }
    .pagos { border-left: 5px solid #FF9800; }
    .alertas { border-left: 5px solid #F44336; }
    
    .recent-activity {
      margin-top: 32px;
    }
  `
})
export class DashboardComponent {

}
