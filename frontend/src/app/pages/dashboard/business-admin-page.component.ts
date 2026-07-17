import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { BusinessStepComponent } from './components/business-step/business-step.component';
import { MenuPreviewComponent } from './components/menu-preview/menu-preview.component';

@Component({
  selector: 'app-business-admin-page',
  imports: [BusinessStepComponent, MatCardModule, MenuPreviewComponent],
  templateUrl: './business-admin-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BusinessAdminPageComponent {
  protected readonly savedMessage = signal('');

  protected confirmSaved(): void {
    this.savedMessage.set('Datos del negocio guardados');
    setTimeout(() => this.savedMessage.set(''), 1800);
  }
}
