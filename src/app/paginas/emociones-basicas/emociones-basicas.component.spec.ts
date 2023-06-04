import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmocionesBasicasComponent } from './emociones-basicas.component';

describe('EmocionesBasicasComponent', () => {
  let component: EmocionesBasicasComponent;
  let fixture: ComponentFixture<EmocionesBasicasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmocionesBasicasComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmocionesBasicasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
