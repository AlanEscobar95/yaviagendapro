import { TestBed } from '@angular/core/testing';

import { NotificarTareasService } from './notificar-tareas.service';

describe('NotificarTareasService', () => {
  let service: NotificarTareasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificarTareasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
