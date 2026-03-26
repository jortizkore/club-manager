import { Routes } from '@angular/router';
import { MainLayoutComponent } from './components/main-layout/main-layout.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginViewComponent } from './components/login-view/login-view.component';
import { RegisterViewComponent } from './components/register-view/register-view.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginViewComponent },
    { path: 'register', component: RegisterViewComponent },
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            // Other routes will be added here
            { path: 'groups', loadComponent: () => import('./components/grupos-list/grupos-list.component').then(c => c.GruposListComponent) },
            { path: 'plans', loadComponent: () => import('./components/planes-list/planes-list.component').then(c => c.PlanesListComponent) },
            { path: 'prospects', loadComponent: () => import('./components/prospects-list/prospects-list.component').then(c => c.ProspectsListComponent) },
            { path: 'subscriptions', loadComponent: () => import('./components/subscriptions-list/subscriptions-list.component').then(c => c.SubscriptionsListComponent) },
            { path: 'payments', loadComponent: () => import('./components/payments-list/payments-list.component').then(c => c.PaymentsListComponent) },
        ]
    }
];
