import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed, getTestBed } from '@angular/core/testing';

import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { API_URL, PULSE_DAYS } from 'config';
import { AppService, getFaction } from './app.service';
import { Player } from './app.model';
import { Pulse } from './utils/pulse.type';

describe('AppService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [provideHttpClient(withXhr(), withInterceptorsFromDi()), provideHttpClientTesting()],
    }).compileComponents();

    injector = getTestBed();
    httpMock = injector.inject(HttpTestingController);
  });

  afterEach(() => {
    const requests = httpMock.match(() => true);
    for (const req of requests) {
      req.flush([]);
    }
    httpMock.verify();
  });

  it('getFaction() should work correctly', () => {
    const horde = [2, 5, 6, 8, 9, 10];
    const alliance = [1, 3, 4, 7, 11];

    for (const i of horde) {
      expect(getFaction(i)).toBe('horde');
    }

    for (const i of alliance) {
      expect(getFaction(i)).toBe('alliance');
    }

    expect(getFaction(13)).toBe('');
  });

  it('players resource should work correctly', () => {
    const service: AppService = TestBed.inject(AppService);
    TestBed.flushEffects();

    const mockData: Player[] = [
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

    expect(service.players.value()).toEqual([]);
    expect(service.allianceCount()).toBe(0);
    expect(service.hordeCount()).toBe(0);

    const req = httpMock.expectOne(`${API_URL}/characters/online`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
    TestBed.flushEffects();

    expect(service.players.value()).toEqual([{ ...mockData[0], faction: 'alliance' }]);
    expect(service.allianceCount()).toBe(1);
    expect(service.hordeCount()).toBe(0);
  });

  it('pulse resource should work correctly', () => {
    const service: AppService = TestBed.inject(AppService);
    TestBed.flushEffects();

    const mockData: Pulse = {
      accounts: 3,
      IPs: 1,
    };

    expect(service.pulse.value()).toEqual([]);

    const req = httpMock.expectOne(`${API_URL}/auth/pulse/${PULSE_DAYS}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
    TestBed.flushEffects();

    expect(service.pulse.value()).toEqual(mockData);
  });
});

