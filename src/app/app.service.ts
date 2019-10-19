import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config';
import { PlayerType } from './utils/player.type';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  get hordeCount()    { return this._hordeCount;    }
  get allianceCount() { return this._allianceCount; }
  get players()       { return this._players;       }

  private _hordeCount = 0;
  private _allianceCount = 0;
  private _players: PlayerType[] = [];

  private getPlayers(): Observable<PlayerType[]> {
    return this.http.get<PlayerType[]>(API_URL + '/characters/online');
  }

  loadPlayers() {
    return this.getPlayers().subscribe((data) => {
      this._players = data;

      for (const player of data) {
        player.faction = this.getFaction(player.race);
      }

    });
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
