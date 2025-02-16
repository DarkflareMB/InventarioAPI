import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true, 
  imports: [FormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) { }

  login() {
    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token); // Guardar el token
        alert('Credenciales correctas'); // Mostrar mensaje de éxito
        this.router.navigate(['/inventario']); // Redirigir a la pantalla de inventario
      },
      error: (err) => {
        alert('Credenciales incorrectas'); // Mostrar mensaje de error
      }
    });
  }
}
