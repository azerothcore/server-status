import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_URL, PULSE_DAYS } from 'config';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PlayerType } from './utils/player.type';
import { Pulse } from './utils/pulse.type';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly http: HttpClient = inject(HttpClient);

  get hordeCount(): number {
    return this._hordeCount;
  }
  get allianceCount(): number {
    return this._allianceCount;
  }
  get players$(): Observable<PlayerType[]> {
    return this._players$;
  }
  get pulse$(): Observable<Pulse> {
    return this._pulse$;
  }

  private _pulse$: Observable<Pulse> = this.http.get<Pulse>(API_URL + '/auth/pulse/' + PULSE_DAYS);
  private _hordeCount = 0;
  private _allianceCount = 0;

  private _players$: Observable<PlayerType[]> = this.http.get<PlayerType[]>(API_URL + '/characters/online').pipe(
    map((data) => {
      data.forEach((player, idx) => {
        data[idx]['faction'] = this.getFaction(player.race);
      });
      return data;
    }),
  );

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
