export const enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
  CUSTOM = 'custom',
  NONE = 'none',
}

export interface Player {
  guid: number;
  name: string;
  race: number;
  class: number;
  gender: number;
  level: number;
  map: number;
  instance_id: number;
  zone: number;
  guildId: number;
  guildName: string;
  faction?: string; // Optional because it's computed later
}
