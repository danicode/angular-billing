import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService } from '../cliente.service';
import { ModalService } from './modal.service';

import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from 'src/app/usuarios/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FacturaService } from '../../facturas/services/factura.service';
import { Factura } from 'src/app/facturas/models/factura';

@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

  @Input() cliente: Cliente = new Cliente();

  titulo: string = "Detalle del cliente";
  private _fotoSeleccionada: File | null = null;
  progreso: number = 0;
  isLogged: boolean;
  isAdmin: boolean;
  img_url = environment.client_img_url;

  constructor(private clienteService: ClienteService,
    private facturaService: FacturaService,
    private _modalService: ModalService,
    private authService: AuthService,
    private router: Router) { 
      this.isLogged = false;
      this.isAdmin = false;
      this.getLogged();
    }

  ngOnInit() {
    this.router.events
      .subscribe((event) => {
        this.getLogged();
      });
  }

  get fotoSeleccionada(): File | null {
    return this._fotoSeleccionada;
  }

  set fotoSeleccionada(fotoSeleccionada: File | null) {
    this._fotoSeleccionada = fotoSeleccionada;
  }

  get modalService(): ModalService {
    return this._modalService;
  }

  set modalService(modalService: ModalService) {
    this._modalService = modalService;
  }

  seleccionarFoto(event: any) {
    this.fotoSeleccionada = event.target.files[0];
    this.progreso = 0;
    if (this.fotoSeleccionada && this.fotoSeleccionada.type.indexOf('image') < 0) {
      swal.fire('Error seleccionar imagen: ', 'El archivo debe ser del tipo imagen', 'error');
      this.fotoSeleccionada = null;
    }
  }

  subirFoto() {

    if (!this.fotoSeleccionada) {
      swal.fire('Error Upload: ', 'Debe seleccionar una foto', 'error');
    } else {
      this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
        .subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            const total = event.total ? event.total : 0;
            this.progreso = Math.round((event.loaded / total) * 100);
          } else if (event.type === HttpEventType.Response) {
            let response: any = event.body;
            this.cliente = response.cliente as Cliente;

            this.modalService.notificarUpload.emit(this.cliente);
            swal.fire('La foto se ha subido completamente!', response.mensaje, 'success');
          }
        });
    }
  }

  cerrarModal() {
    this.modalService.cerrarModal();
    this.fotoSeleccionada = null;
    this.progreso = 0;
  }

  getLogged(): void {
    this.isLogged = this.authService.isAuthenticated();
    this.isAdmin = this.authService.hasRole('ROLE_ADMIN');
  }

  delete(factura: Factura): void {

    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: 'Está seguro?',
      text: `¿Seguro que desea eliminar la factura ${factura.descripcion}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '¡Si, eliminar!',
      cancelButtonText: '¡No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {

        this.facturaService.delete(factura.id).subscribe(
          () => {
            this.cliente.facturas = this.cliente.facturas && this.cliente.facturas.filter(f => f !== factura);
            swal.fire(
              'Factura Eliminada!',
              `Factura ${factura.descripcion} eliminada con éxito.`,
              'success'
            )
          }
        )

      }
    });
  }
}
