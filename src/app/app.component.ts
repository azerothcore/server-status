import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PULSE_DAYS, SERVER_NAME } from 'config';
import { AppService } from './app.service';
import { map } from './utils/zone';

// === Enum for Sorting Direction ===
enum SortDirection {
  ASC = 'asc',
  DESC = 'desc',
  CUSTOM = 'custom',
  NONE = 'none'
}

// === Interface for Player Data ===
interface Player {
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
  faction?: string;   // Optional because it's computed later
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule],  // Import needed for Data-binding of search bar
})
export class AppComponent {
  // === Dependency Injection ===
  protected readonly service: AppService = inject(AppService);

  // === Constants for Template Binding ===
  protected readonly SERVER_NAME = SERVER_NAME;
  protected readonly PULSE = PULSE_DAYS;
  protected readonly map = map;  // Zone ID -> Zone Name

  // === Search Term for Filtering Players ===
  protected searchTerm: string = '';

  // === Sorting State ===
  protected sortColumn: string = '';
  protected sortDirection: SortDirection = SortDirection.ASC;

  /**
   * Filter and Sort players list dynamically based on searchTerm and selected column.
   * This method is called directly from the template to update the displayed list.
   */
  protected filteredPlayers(): Player[] {
    let players: Player[] = this.service.players() || [];

    // === Filter players by search term (only on name and guild) ===
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      players = players.filter(player =>
        player.name.toLowerCase().includes(term) ||
        player.guildName.toLowerCase().includes(term)
      );
    }

    // === Sort players if a column is selected ===
    if (this.sortColumn) {
      players = players.sort((a, b) => {
        let valueA: any = a[this.sortColumn];
        let valueB: any = b[this.sortColumn];

        // Handle 'zone' with zone names instead of IDs
        if (this.sortColumn === 'zone') {
          valueA = this.map[a.zone] || '';
          valueB = this.map[b.zone] || '';
        }

        // Numeric comparison
        if (typeof valueA === 'number' && typeof valueB === 'number') {
          return this.sortDirection === SortDirection.ASC ? valueA - valueB : valueB - valueA;
        }

        // String comparison (case insensitive)
        if (typeof valueA === 'string') valueA = valueA.toLowerCase();
        if (typeof valueB === 'string') valueB = valueB.toLowerCase();

        if (valueA < valueB) return this.sortDirection === SortDirection.ASC ? -1 : 1;
        if (valueA > valueB) return this.sortDirection === SortDirection.ASC ? 1 : -1;
        return 0;
      });
    }

    return players;
  }

  /**
   * Handle column click for sorting.
   * If the same column is clicked again, toggle between ascending and descending.
   * If a new column is clicked, default to ascending order.
   */
  protected sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC;
    } else {
      this.sortColumn = column;
      this.sortDirection = SortDirection.ASC;
    }
  }

  /**
   * Display the sort icon (▲ or ▼) next to the sorted column.
   * If the column is not currently sorted, return an empty string.
   */
  protected getSortIcon(column: string): string {
    if (this.sortColumn !== column) return '';
    return this.sortDirection === SortDirection.ASC ? '▴' : '▾';
  }
}
