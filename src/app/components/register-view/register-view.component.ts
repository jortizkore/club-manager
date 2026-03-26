import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { AlertsService } from '../../services/alerts.service';

@Component({
  selector: 'app-register-view',
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  providers: [AuthService, AlertsService],
  templateUrl: './register-view.component.html',
  styleUrl: './register-view.component.css'
})
export class RegisterViewComponent {
  clubID: string = '';
  login: string = '';
  password: string = '';

  private authService = inject(AuthService);
  private alertsService = inject(AlertsService);

  onSubmit() {
    if (!this.clubID || !this.login || !this.password) {
      this.alertsService.error('Por favor llenar todos los campos');
      return;
    }

    this.authService.registerUser(this.clubID, this.login, this.password);
  }
}
