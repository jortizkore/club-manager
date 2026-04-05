import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../../services/auth.service';
import { AlertsService } from '../../services/alerts.service';
import { UserRegistrationDialogComponent } from './user-registration-dialog/user-registration-dialog.component';

@Component({
  selector: 'app-register-view',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule],
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.css'
})
export class RegisterViewComponent {
  clubID: string = '';
  login: string = '';
  password: string = '';
  usuarioUID: string = '';

  private authService = inject(AuthService);
  private alertsService = inject(AlertsService);
  private dialog = inject(MatDialog);

  openUserRegistrationDialog() {
    const dialogRef = this.dialog.open(UserRegistrationDialogComponent, {
      width: '600px',
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.usuarioUID = result;
        this.alertsService.success('ID de usuario asignado para el login');
      }
    });
  }

  onSubmit() {
    if (!this.clubID || !this.login || !this.password) {
      this.alertsService.error('Por favor llenar todos los campos');
      return;
    }

    if (!this.usuarioUID) {
      this.alertsService.error('Por favor registre el usuario primero');
      return;
    }

    this.authService.registerUser(this.clubID, this.login, this.password, this.usuarioUID);
  }
}
