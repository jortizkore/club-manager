import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-view',
  imports: [FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  providers: [AuthService],
  templateUrl: './login-view.component.html',
  styleUrl: './login-view.component.css'
})
export class LoginViewComponent {
  user: string = '';
  password: string = '';
  private authService = inject(AuthService);


  onSubmit() {
    this.authService.loginUser(this.user, this.password);
  }
}
