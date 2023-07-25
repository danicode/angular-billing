import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import swal from 'sweetalert2';
import { tap } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent implements OnInit{

  clientes:Cliente[];
  paginador: any;

  constructor(private clienteService: ClienteService, private activatedRoute: ActivatedRoute) {
    this.clientes = [];
  }

  ngOnInit(): void {
    
    this.activatedRoute.paramMap.subscribe(params => {
      let page: number = 0;
      const pageValue: string | null = params.get('page');
      if (pageValue !== null) {
        page = parseInt(pageValue, 10);
      }
      this.clienteService.getClientes(page)
        .pipe(
          tap(response => {
            console.log('ClientesComponent tap 3');
            (response.content as Cliente[]).forEach(cliente => console.log(cliente.nombre));
          })
        )
        .subscribe(response => {
          this.clientes = response.content as Cliente[];
          this.paginador = response;
        })
      });
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
