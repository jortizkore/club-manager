import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RolesComponent } from './roles.component';
import { FirestoreService } from '../../services/firestore.service';
import { AlertsService } from '../../services/alerts.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;

  beforeEach(async () => {
    const firestoreMock = {
      getCollection: jasmine.createSpy().and.returnValue(of([])),
      addDoc: jasmine.createSpy(),
      updateDoc: jasmine.createSpy(),
      deleteDoc: jasmine.createSpy()
    };
    const alertsMock = {
      success: jasmine.createSpy(),
      error: jasmine.createSpy(),
      question: jasmine.createSpy().and.returnValue(Promise.resolve({ isConfirmed: true }))
    };

    await TestBed.configureTestingModule({
      imports: [RolesComponent, NoopAnimationsModule],
      providers: [
        { provide: FirestoreService, useValue: firestoreMock },
        { provide: AlertsService, useValue: alertsMock }
      ]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
