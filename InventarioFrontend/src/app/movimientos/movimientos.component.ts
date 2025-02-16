import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { FormsModule } from '@angular/forms'; 
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

interface Producto {
  id: number;
  nombre: string;
  cantidad: number;
}

interface Movimiento {
  productoId: number;
  cantidad: number;
  tipo: string;
}

@Component({
  selector: 'app-movimientos',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './movimientos.component.html',
  styleUrls: ['./movimientos.component.css']
})
export class MovimientosComponent {
  productos: Producto[] = [];
  movimiento: Movimiento = { productoId: 0, cantidad: 0, tipo: 'entrada' };
  mensaje: string = '';

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.cargarProductos();
  }

  cargarProductos() {
    const token = localStorage.getItem('token'); // Obtener el token almacenado

    if (!token) {
      console.error('No hay token disponible. Redirigiendo al login...');
      this.router.navigate(['/login']); // Redirigir si no hay token
      return;
    }

    this.http.get<Producto[]>('https://localhost:7063/productos/inventario', {
      headers: { Authorization: `Bearer ${token}` } // Agregar el token en la cabecera
    }).subscribe({
      next: (response) => {
        console.log('Productos recibidos:', response);
        this.productos = response;
      },
      error: (err) => {
        console.error('Error al cargar los productos', err);
        if (err.status === 401) {
          console.error('Token inválido o expirado. Redirigiendo al login...');
          this.router.navigate(['/login']); // Redirigir si hay error de autenticación
        }
      }
    });
  }


  registrarMovimiento() {
    this.http.post('https://localhost:7063/productos/movimiento', this.movimiento).subscribe({
      next: () => {
        this.mensaje = 'Movimiento registrado con éxito';
        this.cargarProductos(); // Recargar la lista de productos
      },
      error: (err) => {
        this.mensaje = 'Error al registrar el movimiento';
        console.error(err);
      }
    });
  }

  irAInventario() {
    this.router.navigate(['/inventario']);
  }
}
