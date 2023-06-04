import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReconocimientoEmocionesComponent } from './reconocimiento-emociones.component';

describe('ReconocimientoEmocionesComponent', () => {
  let component: ReconocimientoEmocionesComponent;
  let fixture: ComponentFixture<ReconocimientoEmocionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReconocimientoEmocionesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReconocimientoEmocionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



