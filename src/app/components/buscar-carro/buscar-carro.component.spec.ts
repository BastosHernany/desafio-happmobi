import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BuscarCarroComponent } from './buscar-carro.component';

describe('BuscarCarroComponent', () => {
  let component: BuscarCarroComponent;
  let fixture: ComponentFixture<BuscarCarroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BuscarCarroComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BuscarCarroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
