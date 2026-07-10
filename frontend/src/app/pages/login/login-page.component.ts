import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '@services/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly activatedRoute = inject(ActivatedRoute);

  protected readonly errorMessage = signal('');
  protected readonly showPassword = signal(false);
  protected readonly loginForm = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
  });

  constructor() {
    if (this.authService.isAuthenticated()) {
      void this.router.navigateByUrl(this.authService.getCurrentHomeRoute());
    }
  }

  protected submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.errorMessage.set('');

    const result = this.authService.login(
      this.loginForm.controls.email.value,
      this.loginForm.controls.password.value,
    );

    if (!result.success || !result.redirectTo) {
      this.errorMessage.set('Correo o contrasena incorrectos.');
      return;
    }

    const redirectTo =
      this.activatedRoute.snapshot.queryParamMap.get('redirectTo') ??
      result.redirectTo;

    void this.router.navigateByUrl(redirectTo);
  }

  protected togglePasswordVisibility(): void {
    this.showPassword.update((currentValue) => !currentValue);
  }
}
