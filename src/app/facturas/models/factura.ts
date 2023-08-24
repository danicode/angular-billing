import { Cliente } from "src/app/clientes/cliente";
import { ItemFactura } from "./item-factura";

export class Factura {
  id: number;
  descripcion: string;
  observacion: string;
  items: Array<ItemFactura>;
  cliente: Cliente;
  createAt: string;
  total: number;

  constructor() {
    this.id = 0;
    this.descripcion = '';
    this.observacion = '';
    this.items = new Array<ItemFactura>();
    this.cliente = new Cliente();
    this.createAt = '';
    this.total = 0;
  }

  calcularGranTotal(): number {
    this.total = 0;
    this.items.forEach((item: ItemFactura) => {
      this.total += item.calcularImporte();
    });
    return this.total;
  }
}
