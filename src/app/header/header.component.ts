import { Component, OnInit } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { environment } from 'src/environments/environment';
import { Usuario } from '../usuarios/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {
  title:string =  'App Angular';

  logout_url = environment.logout_url;
  isLogged: boolean;
  isAdmin: boolean;
  usuario: Usuario | null;

  constructor(
    private authService: AuthService, private router: Router
  ) { 
    this.isLogged = false;
    this.isAdmin = false;
    this.usuario = null;
  }

  ngOnInit(): void {
    this.router.events
      .subscribe((event) => {
        this.getLogged();
      });
  }

  onLogin(): void {
    location.href = this.authService.getCodeUrl();
  }

  onLogout(): void {
    this.authService.logout();
    location.href = this.logout_url;
  }

  getLogged(): void {
    this.isLogged = this.authService.isAuthenticated();
    this.isAdmin = this.authService.hasRole('ROLE_ADMIN');
    this.usuario = this.authService.user;
  }

}