# MiniSistema de Gestión de Inventario
Sistema básico para gestionar inventario con C# .NET y Angular.

///REQUISITOS 

Tecnologías
Backend: C# .NET 9, Entity Framework Core, PostgreSQL
Frontend: Angular v19, TypeScript
Autenticación: JWT (Bearer Token)
Base de datos: PostgreSQL con una tabla llamada: productos
Patrón de arquitectura: API RESTful

///Instalación y Configuración

//1. Clonar el Repositorio
git clone https://github.com/DarkflareMB/InventarioAPI.git
cd InventarioAPI

///2. Configurar la Base de Datos

-- Crear la tabla `productos`
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL
);

/// Insertar datos en la tabla `productos`

INSERT INTO productos (nombre, cantidad) VALUES
('Caja de cartón pequeña', 500),
('Caja de cartón mediana', 400),
('Caja de cartón grande', 300),
('Pallet de madera', 150),
('Pallet de plástico', 200),
('Film stretch', 1000),
('Cinta adhesiva industrial', 800),
('Etiqueta RFID', 1200),
('Código de barras', 900),
('Bolsa de aire para embalaje', 700),
('Espuma protectora', 600),
('Cajas plásticas reutilizables', 250),
('Carro de carga', 50),
('Montacargas eléctrico', 10),
('Estantería metálica', 75),
('Guantes de seguridad', 300),
('Chaleco reflectivo', 200),
('Zapatos de seguridad', 150),
('Escáner de código de barras', 80),
('Impresora térmica de etiquetas', 40);



///Revisa appsettings.json y configura la conexión a tu base de datos:

"ConnectionStrings": {
  "PostgreSQL": "Host=localhost;Port=5432;Database=InventarioDB;Username=postgres;Password=admin"
}

///3. Iniciar el Backend

cd InventarioAPI
dotnet restore
dotnet run

El servidor se ejecutará en https://localhost:7063/.


4. Iniciar el Frontend
cd InventarioFrontend
npm install
ng serve --open
El frontend se ejecutará en http://localhost:4200/.

ADVERTENCIA
No tenga conflictos en los puertos 7063 y 4200 (si esos puertos están ocupados en su PC, deberá cambiarlos manualmente).


Endpoints Clave

//Autenticación

POST /auth/login → { "username": "admin", "password": "admin" }
Inventario

GET /productos/inventario → Lista los productos.
POST /productos/movimiento → Registra entrada/salida de productos.




