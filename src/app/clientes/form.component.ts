import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router'; 
import swal from 'sweetalert2';
import { of, catchError } from 'rxjs';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  private _cliente: Cliente = new Cliente();
  private _titulo: string = 'Crear cliente';
  private _errors: string[] = [];

  constructor(private clienteService: ClienteService, private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.cargarCliente();
  }

  get cliente(): Cliente {
    return this._cliente;
  }

  set cliente(cliente: Cliente) {
    this._cliente = cliente;
  }

  get titulo(): string {
    return this._titulo;
  }

  get errors(): string[] {
    return this._errors;
  }

  cargarCliente(): void {
    this.activatedRoute.params.subscribe(params => {
      let id = params['id'];
      if (id) {
        this.clienteService.getCliente(id).subscribe(cliente => this.cliente = cliente);
      }
    });
  }

  create(): void {
    this.clienteService
      .create(this.cliente)
      .pipe(
        catchError(err => {
          this._errors = err.error.errors as string[];
          console.error('Código del error desde el backend: ' + err.status);
          console.error(err.error.errors);
          return of(null);
        })
      )
      .subscribe(cliente => {
        if (cliente) {
          this.router.navigate(['/']);
          swal.fire('Nuevo cliente', `El cliente ${cliente?.nombre} ha sido creado con éxito!`, 'success');
        }
      });
  }

  update(): void {
    this.clienteService.update(this.cliente)
    .pipe(
      catchError(err => {
        this._errors = err.error.errors as string[];
        console.error('Código del error desde el backend: ' + err.status);
        console.error(err.error.errors);
        return of(null);
      })
    )
    .subscribe(json => {
      if (json) {
        this.router.navigate(['/clientes']);
        swal.fire('Cliente Actualizado', `${json.mensaje}: ${ json.cliente.nombre }`, 'success');
      }
    });
  }
}
