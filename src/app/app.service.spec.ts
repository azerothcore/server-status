import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, getTestBed, waitForAsync } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { API_URL, PULSE_DAYS } from 'config';
import { AppService } from './app.service';
import { PlayerType } from './utils/player.type';
import { Pulse } from './utils/pulse.type';

describe('AppService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [],
      providers: [provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    injector = getTestBed();

    httpMock = injector.inject(HttpTestingController);
  }));

  afterEach(() => {
    const requests = httpMock.match(() => true);
    for (const req of requests) {
      req.flush({});
    }
    httpMock.verify();
  });

  it('getFaction() should work correctly', () => {
    const service: AppService = TestBed.inject(AppService);

    const horde = [2, 5, 6, 8, 9, 10];
    const alliance = [1, 3, 4, 7, 11];

    expect(service.hordeCount).toBe(0);
    expect(service.allianceCount).toBe(0);

    for (const i of horde) {
      expect(service['getFaction'](i)).toBe('horde');
    }

    for (const i of alliance) {
      expect(service['getFaction'](i)).toBe('alliance');
    }

    expect(service.hordeCount).toBe(6);
    expect(service.allianceCount).toBe(5);

    expect(service['getFaction'](13)).toBe('');
  });

  it('players observable should work correctly', () => {
    const service: AppService = TestBed.inject(AppService);
    const mockData: PlayerType[] = [
      {
        guid: 1,
        name: 'Helias',
        race: 7,
        class: 8,
        gender: 0,
        level: 80,
        map: 1,
        instance_id: 0,
        zone: 876,
        guildId: 1,
        guildName: 'AzerothCore',
      },
    ];

    mockData[0].faction = 'alliance';

    expect(service.players()).toEqual([]);

    const req = httpMock.expectOne(`${API_URL}/characters/online`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(service.players()).toEqual(mockData);
  });

  it('pulse observable should work correctly', () => {
    const service: AppService = TestBed.inject(AppService);
    const mockData: Pulse = {
      accounts: 3,
      IPs: 1,
    };

    expect(service.pulse()).toEqual([]);

    const req = httpMock.expectOne(`${API_URL}/auth/pulse/${PULSE_DAYS}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    expect(service.pulse()).toEqual(mockData);
  });
});
