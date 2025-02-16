import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'https://localhost:7063/auth/login'; 

  constructor(private http: HttpClient, private router: Router) { }

  // Método para autenticar al usuario
  login(username: string, password: string) {
    const credentials = { username, password };
    return this.http.post<{ token: string }>(this.apiUrl, credentials);
  }

  // Método para cerrar sesión
  logout() {
    localStorage.removeItem('token'); // Eliminar el token
    this.router.navigate(['/login']); // Redirigir al login
  }

  // Método para verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('token'); // Verificar si existe un token
  }
}
