import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearTareasComponent } from './crear-tareas.component';

describe('CrearTareasComponent', () => {
  let component: CrearTareasComponent;
  let fixture: ComponentFixture<CrearTareasComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearTareasComponent]
    });
    fixture = TestBed.createComponent(CrearTareasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
