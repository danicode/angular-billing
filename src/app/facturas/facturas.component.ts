import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { ClienteService } from '../clientes/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FacturaService } from './services/factura.service';

import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Producto } from './models/producto';
import { ItemFactura } from './models/item-factura';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import swal from 'sweetalert2';

@Component({
  selector: 'app-facturas',
  templateUrl: './facturas.component.html',
  styleUrls: ['./facturas.component.css']
})
export class FacturasComponent implements OnInit {

  titulo: string = 'Nueva Factura';
  factura: Factura = new Factura();

  autocompleteControl = new FormControl();

  productosFiltrados: Observable<Producto[]>  = new Observable();

  constructor(private clienteService: ClienteService,
    private facturaService: FacturaService,
    private router: Router,
    private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('clienteId');
      if (id !== null) {
        const clienteId = +id;
        this.clienteService.getCliente(clienteId).subscribe(cliente => this.factura.cliente = cliente);
      }
    });

    this.productosFiltrados = this.autocompleteControl.valueChanges
      .pipe(
        map(value => typeof value === 'string' ? value : value.nombre),
        mergeMap(value => value ? this._filter(value) : [])
      );
  }

  private _filter(value: string): Observable<Producto[]> {
    const filterValue = value.toLowerCase();
    return this.facturaService.filtrarProductos(filterValue);
  }

  mostrarNombre(producto?: Producto): string {
    return producto ? producto.nombre : '';
  }

  seleccionarProducto(event: MatAutocompleteSelectedEvent): void {
    const producto = event.option.value as Producto;

    if (this.existeItem(producto.id)) {
      this.incrementaCantidad(producto.id);
    } else {
      const nuevoItem = new ItemFactura();
      nuevoItem.producto = producto;
      this.factura.items.push(nuevoItem);
    }

    this.autocompleteControl.setValue('');
    event.option.focus();
    event.option.deselect();
  }

  actualizarCantidad(id: number, event: any): void {
    const cantidad: number = event.target.value as number;

    if (cantidad == 0) {
      return this.eliminarItemFactura(id);
    }

    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        item.cantidad = cantidad;
      }
      return item;
    });
  }

  existeItem(id: number): boolean {
    let existe = false;
    this.factura.items.forEach((item: ItemFactura) => {
      if (id === item.producto.id) {
        existe = true;
      }
    });
    return existe;
  }

  incrementaCantidad(id: number): void {
    this.factura.items = this.factura.items.map((item: ItemFactura) => {
      if (id === item.producto.id) {
        ++item.cantidad;
      }
      return item;
    });
  }

  eliminarItemFactura(id: number): void {
    this.factura.items = this.factura.items.filter((item: ItemFactura) => id !== item.producto.id);
  }

  create(facturaForm: any): void {
    if (this.factura.items.length == 0) {
      this.autocompleteControl.setErrors({ 'invalid': true });
    }

    if (facturaForm.form.valid && this.factura.items.length > 0) {
      this.facturaService.create(this.factura).subscribe(factura => {
        swal.fire(this.titulo, `Factura ${factura.descripcion} creada con éxito!`, 'success');
        this.router.navigate(['/clientes']);
      });
    }
  }
}
