import { TestBed } from '@angular/core/testing';

import { CamaraService } from './camara.service';
import { SqliteService } from './sqlite.service';

describe('CamaraService', () => {
  let service: CamaraService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    providers: [SqliteService];
    service = TestBed.inject(CamaraService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
