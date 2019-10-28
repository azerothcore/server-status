import { TestBed, async, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { AppService } from './app.service';
import { PlayerType } from './utils/player.type';
import { API_URL, PULSE_DAYS } from 'config';
import { Pulse } from './utils/pulse.type';

describe('AppService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      declarations: [],
      providers: [
      ]
    })
    .compileComponents();

    injector = getTestBed();

    httpMock = injector.get(HttpTestingController);
  }));

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    const service: AppService = TestBed.get(AppService);
    expect(service).toBeTruthy();
  });

  it('getFaction() should work correctly', () => {
    const service: AppService = TestBed.get(AppService);

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
    const service: AppService = TestBed.get(AppService);
    const mockData: PlayerType[] = [{
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
      guildName: 'AzerothCore'
    }];

    mockData[0].faction = 'alliance';

    service.players.subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${API_URL}/characters/online`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);
  });

  it('pulse observable should work correctly', () => {
    const service: AppService = TestBed.get(AppService);
    const mockData: Pulse = {
      accounts: 3,
      IPs: 1
    };

    service.pulse.subscribe((data) => {
      expect(data).toEqual(mockData);
    });

    const req = httpMock.expectOne(`${API_URL}/auth/pulse/${PULSE_DAYS}`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

  });

});
