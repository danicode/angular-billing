import { Factura } from "../facturas/models/factura";
import { Region } from "./region";
export class Cliente {
  id: number;
  nombre: string;
  apellido: string;
  createAt: string;
  email: string;
  foto: string;
  region: Region | undefined;
  //facturas: Array<Factura>;
  facturas: Factura[] | null;

  constructor() {
    this.id = 0;
    this.nombre = '';
    this.apellido = '';
    this.createAt = '';
    this.email = '';
    this.foto = '';
    this.region = undefined;
    this.facturas = [];
  }
}
