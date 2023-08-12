import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.css']
})
export class AuthorizedComponent implements OnInit {

  private _code = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe( data => {
      this._code = data['code'];
      const code_verifier = this.authService.getVerifier();
      this.authService.deleteVerifier();
      if (code_verifier !== null) {
        this.getToken(this.code, code_verifier);
      }
    });
  }

  public get code(): string {
    return this._code;
  }

  getToken(code: string, code_verifier: string): void {
    this.authService.getToken(code, code_verifier).subscribe({
      next: data => {
        this.authService.setUser(data.access_token);
        this.authService.setTokens(data.access_token, data.refresh_token);
        const usuario = this.authService.user;
        swal.fire('Login', `Hola ${ usuario?.username }, has iniciado sesión con éxito!`, 'success');
        this.router.navigate(['/clientes']);
      },
      error: err => {
        console.error(err);
      }
    });
  }
}
