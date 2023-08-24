import { TestBed } from '@angular/core/testing';

import { FacturasService } from './factura.service';

describe('FacturasService', () => {
  let service: FacturasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
