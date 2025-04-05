import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { API_URL, PULSE_DAYS } from 'config';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PlayerType } from './utils/player.type';
import { Pulse } from './utils/pulse.type';
import { Races } from './utils/races';

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

  private readonly _pulse$ = this.http.get<Pulse[]>(API_URL + '/auth/pulse/' + PULSE_DAYS).pipe(
    catchError(() => {
      console.error('Error loading pulse data from API');

      return of(null);
    }),
  );
  readonly pulse = toSignal(this._pulse$, { initialValue: [] });

  private _hordeCount = 0;
  private _allianceCount = 0;

  private readonly _players$: Observable<PlayerType[]> = this.http.get<PlayerType[]>(API_URL + '/characters/online').pipe(
    tap((data) => {
      for (const playerType of data) {
        playerType['faction'] = this.getFaction(playerType.race);
      }
    }),
    catchError(() => {
      console.log('Error loading players data');

      return of(null);
    }),
  );
  readonly players = toSignal(this._players$, { initialValue: [] });

  private getFaction(race: number): string {
    switch (race) {
      case Races.ORC:
      case Races.UNDEAD:
      case Races.TAUREN:
      case Races.TROLL:
      case Races.GOBLIN:
      case Races.BLOODELF:
        this._hordeCount++;
        return 'horde';
      case Races.HUMAN:
      case Races.DWARF:
      case Races.NIGHTELF:
      case Races.GNOME:
      case Races.DRAENEI:
        this._allianceCount++;
        return 'alliance';
      default:
        return '';
    }
  }
}
