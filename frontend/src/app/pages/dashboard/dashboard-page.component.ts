import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-dashboard-page',
  imports: [MatCardModule],
  templateUrl: './dashboard-page.component.html',
  styleUrl: './dashboard-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPageComponent {
  private readonly authService = inject(AuthService);

  protected readonly currentUser = this.authService.currentUser;
  protected readonly currentAlias = computed(() => {
    const currentUser = this.currentUser();
    return currentUser ? this.authService.getUserAlias(currentUser.email) : '';
  });

  protected readonly sections = [
    {
      title: 'Estructura del menu',
      description:
        'Este espacio queda listo para organizar la carta principal del negocio y definir como se mostrara al cliente.',
    },
    {
      title: 'Categorias y productos',
      description:
        'La base visual ya esta preparada para cargar secciones, platos, precios, descripciones e imagenes.',
    },
    {
      title: 'Vista QR del menu',
      description:
        'Aqui seguiremos con la experiencia publica que recibira el cliente al escanear el codigo QR.',
    },
    {
      title: 'Publicacion y ajustes',
      description:
        'La arquitectura ya contempla temas visuales, promociones y configuracion por negocio para las siguientes fases.',
    },
  ];
}
