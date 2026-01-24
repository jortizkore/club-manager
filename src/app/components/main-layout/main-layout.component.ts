import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport
          [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
          [mode]="(isHandset$ | async) ? 'over' : 'side'"
          [opened]="(isHandset$ | async) === false">
        <mat-toolbar color="primary">Club Manager</mat-toolbar>
        <mat-nav-list>
          <a mat-list-item routerLink="/dashboard" routerLinkActive="active">
            <mat-icon matListItemIcon>dashboard</mat-icon>
            <span matListItemTitle>Dashboard</span>
          </a>
          <a mat-list-item routerLink="/prospects" routerLinkActive="active">
            <mat-icon matListItemIcon>person_search</mat-icon>
            <span matListItemTitle>Prospectos</span>
          </a>
          <a mat-list-item routerLink="/subscriptions" routerLinkActive="active">
            <mat-icon matListItemIcon>card_membership</mat-icon>
            <span matListItemTitle>Membresías</span>
          </a>
          <a mat-list-item routerLink="/payments" routerLinkActive="active">
            <mat-icon matListItemIcon>payments</mat-icon>
            <span matListItemTitle>Pagos</span>
          </a>
          <mat-divider></mat-divider>
          <div mat-subheader>Catálogos</div>
          <a mat-list-item routerLink="/groups" routerLinkActive="active">
            <mat-icon matListItemIcon>groups</mat-icon>
            <span matListItemTitle>Grupos</span>
          </a>
          <a mat-list-item routerLink="/plans" routerLinkActive="active">
            <mat-icon matListItemIcon>assignment</mat-icon>
            <span matListItemTitle>Planes</span>
          </a>
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content>
        <mat-toolbar color="primary" class="toolbar">
          <button
            type="button"
            aria-label="Toggle sidenav"
            mat-icon-button
            (click)="drawer.toggle()"
            *ngIf="isHandset$ | async">
            <mat-icon aria-label="Side nav toggle icon">menu</mat-icon>
          </button>
          <span>Panel de Gestión</span>
          <span class="spacer"></span>
          <button mat-icon-button>
            <mat-icon>account_circle</mat-icon>
          </button>
        </mat-toolbar>
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: `
    .sidenav-container {
      height: 100vh;
    }
    .sidenav {
      width: 250px;
      border-right: 1px solid rgba(0,0,0,0.12);
    }
    .sidenav .mat-toolbar {
      background: #1a237e;
      color: white;
      font-weight: 300;
      letter-spacing: 1px;
    }
    .active {
      background: rgba(26, 35, 126, 0.05);
      color: #1a237e !important;
      font-weight: 500;
    }
    .toolbar {
      position: sticky;
      top: 0;
      z-index: 2;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
    }
    .spacer {
      flex: 1 1 auto;
    }
    .content {
      padding: 24px;
      background: #f5f5f5;
      min-height: calc(100vh - 64px);
    }
    mat-nav-list a {
      margin: 4px 8px;
      border-radius: 8px;
    }
  `
})
export class MainLayoutComponent {
  private breakpointObserver = inject(BreakpointObserver);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );
}
