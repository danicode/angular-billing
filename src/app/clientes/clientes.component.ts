import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit{

  clientes:Cliente[];

  constructor(private clienteService: ClienteService) {
    this.clientes = [];
  }

  ngOnInit(): void {
    this.clienteService.getClientes()
    .pipe(
      tap(clientes => {
        this.clientes = clientes // esto sacamos de .subscribe
        console.log('ClientesComponent tap 3');
        clientes.forEach(cliente => console.log(cliente.nombre));
      })
    )
    .subscribe(
      //clientes => this.clientes = clientes
    );
  }

  delete(cliente: Cliente): void {
     
    const swalWithBootstrapButtons = swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    });

    swalWithBootstrapButtons.fire({
      title: '¿Está seguro?',
      text: `¿Seguro que desea eliminar al cliente ${ cliente.nombre } ${ cliente.apellido }?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '¡Si, eliminar!',
      cancelButtonText: '¡No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.isConfirmed) {

        this.clienteService.delete(cliente.id).subscribe(response => {

          this.clientes = this.clientes.filter(cli => cli != cliente);

          swalWithBootstrapButtons.fire(
            '¡Cliente Eliminado!',
            `¡Cliente ${ cliente.nombre } eliminado con éxito!`,
            'success'
          );
        });
      }
    });
  }
}
