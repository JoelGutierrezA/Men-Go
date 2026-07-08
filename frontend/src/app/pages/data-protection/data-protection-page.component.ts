import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MarketingFooterComponent } from '@shared/ui/marketing-footer/marketing-footer.component';
import { MarketingHeaderComponent } from '@shared/ui/marketing-header/marketing-header.component';

@Component({
  selector: 'app-data-protection-page',
  imports: [
    MarketingHeaderComponent,
    MarketingFooterComponent,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './data-protection-page.component.html',
  styleUrl: './data-protection-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataProtectionPageComponent {}
