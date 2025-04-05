import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PULSE_DAYS, SERVER_NAME } from 'config';
import { AppService } from './app.service';
import { map } from './utils/zone';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AppComponent {
  protected readonly service: AppService = inject(AppService);

  protected readonly SERVER_NAME = SERVER_NAME;
  protected readonly PULSE = PULSE_DAYS;
  protected readonly map = map;
}
