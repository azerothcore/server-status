import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_URL } from 'config';


@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) { }

  hordeCount = 0;
  allianceCount = 0;

  players: any = [];

  loadPlayers() {
    return this.http.get(API_URL + '/characters/online').subscribe((data) => {
      this.players = data;
    });
  }

  getFaction(race: number): string {

    switch (race) {
      case 2:
      case 5:
      case 6:
      case 8:
      case 9:
      case 10:
        this.hordeCount++;
        return 'horde';
      case 1:
      case 3:
      case 4:
      case 7:
      case 11:
        this.allianceCount++;
        return 'alliance';
    }
  }
}
