import { TestBed, async, getTestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import Spy = jasmine.Spy;

import { AppService } from './app.service';
import { HttpClientModule } from '@angular/common/http';
import { PlayerType } from './utils/player.type';
import { API_URL, PULSE_DAYS } from 'config';
import { Pulse } from './utils/pulse.type';

describe('AppService', () => {
  let httpMock: HttpTestingController;
  let injector: TestBed;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
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

  it('getPlayers() and loadPlayers() should work correctly', () => {
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
      guildName: 'AzerothCore',
      faction: ''
    }];

    expect(service.players).toEqual([]);

    service['loadPlayers']();

    const req = httpMock.expectOne(`${API_URL}/characters/online`);
    expect(req.request.method).toBe('GET');
    req.flush(mockData);

    mockData[0].faction = 'alliance';

    expect(service.players).toEqual(mockData);
  });

  it('getPulse() and loadPulse() should work correctly', () => {
    const service: AppService = TestBed.get(AppService);
    const mockData: Pulse = {
      accounts: 3,
      IPs: 1
    };

    expect(service.accounts).toBe(0);
    expect(service.IPs).toBe(0);

    service['loadPulse']();

    const req = httpMock.expectOne(`${API_URL}/auth/pulse/${PULSE_DAYS}`);
    expect(req.request.method).toBe('GET');
    req.flush([mockData]);

    expect(service.accounts).toBe(mockData.accounts);
    expect(service.IPs).toBe(mockData.IPs);
  });

  it('init() should work correctly', () => {
    const service = TestBed.get(AppService);
    const loadPlayersSpy: Spy = spyOn(service, 'loadPlayers');
    const loadPulseSpy: Spy = spyOn(service, 'loadPulse');

    service.init();

    expect(loadPlayersSpy).toHaveBeenCalled();
    expect(loadPulseSpy).toHaveBeenCalled();
  });
});
