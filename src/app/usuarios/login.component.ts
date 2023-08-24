import { Component } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  titulo: string = '¡Por favor iniciar sesión!';
  usuario: Usuario;

  constructor() {
    this.usuario = new Usuario();
  }

  login(): void {
    if (this.usuario.username == null || this.usuario.password == null) {
      swal.fire('Error login', '¡Username o password vacías!', 'error');
      return;
    }
  }
  
}
