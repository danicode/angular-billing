import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  if (!authService.isAuthenticated()) {
    swal.fire('Acceso denegado', 'No tienes acceso a este recurso!', 'warning');
    router.navigate(['/clientes']);
    return false;
  }

  let role = route.data['role'] as string;

  if (authService.hasRole(role)) {
    return true;
  }
  swal.fire('Acceso denegado', `Hola ${authService.user?.username} no tienes acceso a este recurso!`, 'warning');
  router.navigate(['/clientes']);
  return false;
};
