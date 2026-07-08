import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-marketing-header',
  imports: [MatButtonModule, RouterLink, RouterLinkActive],
  templateUrl: './marketing-header.component.html',
  styleUrl: './marketing-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MarketingHeaderComponent {}
