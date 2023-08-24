import { Component, OnInit } from '@angular/core';
import { Factura } from './models/factura';
import { FacturaService } from './services/factura.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-detalle-factura',
  templateUrl: './detalle-factura.component.html',
  styleUrls: ['./detalle-factura.component.css']
})
export class DetalleFacturaComponent implements OnInit {

  factura: Factura;
  titulo: string = 'Factura';

  constructor(private facturaService: FacturaService,
    private activatedRoute: ActivatedRoute) { 
      this.factura = new Factura();
    }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id !== null) {
        this.facturaService.getFactura(+id).subscribe(factura => {
          this.factura = factura;
        });
      }
    });
  }
}
