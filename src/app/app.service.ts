import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, PULSE_DAYS } from 'config';
import { PlayerType } from './utils/player.type';
import { Pulse } from './utils/pulse.type';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  get hordeCount()    { return this._hordeCount;    }
  get allianceCount() { return this._allianceCount; }
  get players()       { return this._players;       }
  get accounts()      { return this._accounts;      }
  get IPs()           { return this._IPs;           }

  private _accounts = 0;
  private _IPs = 0;
  private _hordeCount = 0;
  private _allianceCount = 0;
  private _players: PlayerType[] = [];

  private getPlayers(): Observable<PlayerType[]> {
    return this.http.get<PlayerType[]>(API_URL + '/characters/online');
  }

  private getAccounts(): Observable<Pulse> {
    return this.http.get<Pulse>(API_URL + '/auth/pulse/' + PULSE_DAYS);
  }

  loadPlayers() {
    return this.getPlayers().subscribe((data) => {
      this._players = data;

      for (const player of data) {
        player.faction = this.getFaction(player.race);
      }

    });
  }

  loadPulse() {
    return this.getAccounts().subscribe((data) => {
      this._accounts = data[0].accounts;
      this._IPs = data[0].IPs;
    });
  }

  init() {
    this.loadPlayers();
    this.loadPulse();
  }

  private getFaction(race: number): string {

    switch (race) {
      case 2:
      case 5:
      case 6:
      case 8:
      case 9:
      case 10:
        this._hordeCount++;
        return 'horde';
      case 1:
      case 3:
      case 4:
      case 7:
      case 11:
        this._allianceCount++;
        return 'alliance';
      default:
        return '';
    }

  }
}
