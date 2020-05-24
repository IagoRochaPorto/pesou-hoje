import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { AddWeightComponent } from './add-weight.component';

describe('AddWeightComponent', () => {
  let component: AddWeightComponent;
  let fixture: ComponentFixture<AddWeightComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddWeightComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(AddWeightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
