import { Producto } from "./producto";

export class ItemFactura {
  id: number;
  producto: Producto;
  cantidad: number;
  importe: number;

  constructor() {
    this.id = 0;
    this.producto = new Producto();
    this.cantidad = 1;
    this.importe = 0;
  }

  public calcularImporte(): number {
    return this.cantidad * this.producto.precio;
  }
}
