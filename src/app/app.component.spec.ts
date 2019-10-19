import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppService } from './app.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));

  it('onInit should work correctly', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    const loadPlayersSpy = spyOn(TestBed.get(AppService), 'init');
    expect(app).toBeTruthy();

    fixture.detectChanges();

    expect(loadPlayersSpy).toHaveBeenCalled();
  });


});
