import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
    const router = inject(Router);
    const loggedUser = localStorage.getItem('loggedUser');
    debugger

    if (loggedUser) {
        return true;
    } else {
        router.navigate(['/login']);
        return false;
    }
};
