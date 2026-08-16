import { computed, Service } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { API_URL, PULSE_DAYS } from 'config';
import { Player } from './app.model';
import { Pulse } from './utils/pulse.type';
import { Races } from './utils/races';

export function getFaction(race: number): string {
  switch (race) {
    case Races.ORC:
    case Races.UNDEAD:
    case Races.TAUREN:
    case Races.TROLL:
    case Races.GOBLIN:
    case Races.BLOODELF:
      return 'horde';
    case Races.HUMAN:
    case Races.DWARF:
    case Races.NIGHTELF:
    case Races.GNOME:
    case Races.DRAENEI:
    case Races.WORGEN:
      return 'alliance';
    default:
      return '';
  }
}

@Service()
export class AppService {
  readonly players = httpResource<Player[]>(() => `${API_URL}/characters/online`, {
    defaultValue: [],
    parse: (raw) => (raw as Player[]).map((p) => ({ ...p, faction: getFaction(p.race) })),
  });

  readonly pulse = httpResource<Pulse[]>(() => `${API_URL}/auth/pulse/${PULSE_DAYS}`, {
    defaultValue: [],
  });

  readonly hordeCount = computed(() => this.players.value().filter((p) => p.faction === 'horde').length);
  readonly allianceCount = computed(() => this.players.value().filter((p) => p.faction === 'alliance').length);
}
