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

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent {
  productos: Producto[] = []; // Lista completa de productos
  productosFiltrados: Producto[] = []; // Lista filtrada y ordenada
  filtroNombre: string = ''; // Texto del buscador
  ordenAscendente: boolean = true; // Indica si la ordenación es ascendente o descendente
  ordenActual: keyof Producto = 'id'; // Campo de orden actual
  paginaActual: number = 1; // Página actual
  elementosPorPagina: number = 15; // Elementos por página
  modoOscuro: boolean = false;


  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.cargarInventario();
  }

  cargarInventario() {
    const token = localStorage.getItem('token'); // Obtener el token almacenado

    if (!token) {
      console.error('No hay token disponible. Redirigiendo al login...');
      this.router.navigate(['/login']);
      return;
    }

    this.http.get<Producto[]>('https://localhost:7063/productos/inventario', {
      headers: { Authorization: `Bearer ${token}` }
    }).subscribe({
      next: (response) => {
        console.log('Inventario recibido:', response);
        this.productos = response;
        this.aplicarFiltro(); // Aplicar filtro inicial
      },
      error: (err) => {
        console.error('Error al cargar el inventario', err);
        if (err.status === 401) {
          console.error('Token inválido o expirado. Redirigiendo al login...');
          this.router.navigate(['/login']);
        }
      }
    });
  }

  // Aplicar filtro por nombre
  aplicarFiltro() {
    this.productosFiltrados = this.productos.filter(p =>
      p.nombre.toLowerCase().includes(this.filtroNombre.toLowerCase())
    );
    this.ordenarPor(this.ordenActual); // Mantener el orden actual después de filtrar
  }

  // Ordenar por columna seleccionada
  ordenarPor(campo: keyof Producto) {
    if (this.ordenActual === campo) {
      this.ordenAscendente = !this.ordenAscendente; // Invertir el orden si se selecciona la misma columna
    } else {
      this.ordenActual = campo; // Cambiar la columna de orden
      this.ordenAscendente = true; // Reiniciar a ascendente
    }

    this.productosFiltrados.sort((a, b) => {
      if (a[campo] < b[campo]) return this.ordenAscendente ? -1 : 1;
      if (a[campo] > b[campo]) return this.ordenAscendente ? 1 : -1;
      return 0;
    });
  }

  // Cambiar la cantidad de elementos por página
  cambiarElementosPorPagina(cantidad: number) {
    this.elementosPorPagina = cantidad;
    this.paginaActual = 1; // Reiniciar a la primera página
  }

  // Obtener los productos de la página actual
  get productosPaginaActual(): Producto[] {
    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    const fin = inicio + this.elementosPorPagina;
    return this.productosFiltrados.slice(inicio, fin);
  }

  // Navegar a la página de movimientos
  irAMovimientos() {
    this.router.navigate(['/movimientos']);
  }

  // Cerrar sesión
  cerrarSesion() {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  // Exportar a CSV
  exportarCSV() {
    let csvContent = 'ID,Nombre,Cantidad\n';
    this.productosFiltrados.forEach(p => {
      csvContent += `${p.id},${p.nombre},${p.cantidad}\n`;
    });
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'inventario.csv';
    a.click();
  }

  // Cambiar modo oscuro
  cambiarModo() {
    this.modoOscuro = !this.modoOscuro;
    document.body.classList.toggle('modo-oscuro', this.modoOscuro);
  }


  getStockClass(cantidad: number): string {
    if (cantidad < 50) {
      return 'stock-bajo';
    } else if (cantidad > 100) {
      return 'stock-alto';
    }
    return 'stock-medio';
  }
}
