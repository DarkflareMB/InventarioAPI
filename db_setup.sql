-- Crear la base de datos (Si no existe)
CREATE DATABASE InventarioDB;

-- Conectar a la base de datos
--\c InventarioDB;

-- Crear la tabla `productos`
CREATE TABLE productos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cantidad INT NOT NULL
);

-- Insertar datos iniciales en la tabla `productos`
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
