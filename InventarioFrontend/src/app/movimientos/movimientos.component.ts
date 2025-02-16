import { Component, HostListener } from '@angular/core';
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
  productosFiltrados: Producto[] = []; // Para filtrar productos en tiempo real
  productoBusqueda: string = ''; 
  movimiento: Movimiento = { productoId: 0, cantidad: 0, tipo: 'entrada' };
  mensaje: string = '';
  mostrarLista: boolean = false;
  modoOscuro: boolean = false

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.cargarProductos();
  }

  /* ======== Cargar productos ======== */
  cargarProductos() {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token disponible. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<Producto[]>('https://localhost:7063/productos/inventario', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        console.log('Productos recibidos:', response);
        this.productos = response;
        this.productosFiltrados = response; // Inicializa la lista filtrada
      },
      error: (err) => {
        console.error('Error al cargar los productos', err);
        if (err.status === 401) {
          console.error('Token inválido o expirado. Redirigiendo al login...');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  /* ======== Filtrar productos en tiempo real ======== */
  filtrarProductos() {
    const busqueda = this.productoBusqueda.toLowerCase();
    this.productosFiltrados = this.productos.filter(producto =>
      producto.nombre.toLowerCase().includes(busqueda)
    );
  }

  /* ======== Seleccionar Producto de la Lista ======== */
  seleccionarProducto(producto: Producto) {
    console.log('Producto seleccionado:', producto);
    this.productoBusqueda = producto.nombre;
    this.movimiento.productoId = producto.id;
    this.mostrarLista = false;
  }


  /* ======== Validar si el producto escrito es válido ======== */
  validarProductoSeleccionado() {
    const productoEncontrado = this.productos.find(p => p.nombre.toLowerCase().trim() === this.productoBusqueda.toLowerCase().trim());

    if (productoEncontrado) {
      this.movimiento.productoId = productoEncontrado.id;
      this.mensaje = '';
    } else if (this.movimiento.productoId === 0) { // Solo cambiar si no hay ID previo
      this.mensaje = "Error: Seleccione un producto válido.";
    }
  }


  /* ======== Registrar Movimiento ======== */
  registrarMovimiento() {
    const productoSeleccionado = this.productos.find(p => p.nombre.toLowerCase() === this.productoBusqueda.toLowerCase());

    if (!productoSeleccionado) {
      this.mensaje = 'Error: Seleccione un producto válido.';
      return;
    }

    this.movimiento.productoId = productoSeleccionado.id; // Asigna el ID del producto correctamente

    if (this.movimiento.tipo === 'salida' && this.movimiento.cantidad > productoSeleccionado.cantidad) {
      this.mensaje = 'Error: La cantidad de salida excede el inventario disponible.';
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No hay token disponible. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    const headers = {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    this.http.post('https://localhost:7063/productos/movimiento', this.movimiento, { headers }).subscribe({
      next: () => {
        this.mensaje = 'Movimiento registrado con éxito';
        this.productoBusqueda = ''; // Limpiar input
        this.movimiento.cantidad = 0;
        this.movimiento.tipo = 'entrada';
        this.cargarProductos(); // Refrescar inventario
      },
      error: (err) => {
        this.mensaje = 'Error al registrar el movimiento: ' + err.error.message;
        console.error(err);
      }
    });
  }


  /* ======== Redirigir a Inventario ======== */
  irAInventario() {
    this.router.navigate(['/inventario']);
  }

  /* ======== Ocultar lista al hacer clic fuera ======== */
  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const isClickInside = target.closest('.form-group') !== null;

    if (!isClickInside) {
      this.mostrarLista = false;
    }
  }
}
