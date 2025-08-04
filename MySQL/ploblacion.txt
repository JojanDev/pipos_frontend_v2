	drop database if exists veterinaria_pipos;
create database veterinaria_pipos;
use veterinaria_pipos;

CREATE TABLE tipos_documento (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL
);

CREATE TABLE informacion_clientes_personal (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_tipo_documento INT NOT NULL,
	numero_documento VARCHAR(50) NOT NULL,
	nombre VARCHAR(255) NOT NULL,
	telefono VARCHAR(20) NOT NULL,
	correo VARCHAR(255),
	direccion VARCHAR(255) NOT NULL,
	FOREIGN KEY (id_tipo_documento) REFERENCES tipos_documento(id)
);

CREATE TABLE roles(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(255) NOT NULL DEFAULT 2
);

CREATE TABLE personal (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_info INT NOT NULL,
    id_rol INT NOT NULL,
	usuario VARCHAR(100) UNIQUE NOT NULL,
	contrasena VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_rol) REFERENCES roles(id),
	FOREIGN KEY (id_info) REFERENCES informacion_clientes_personal(id)
);

CREATE TABLE clientes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_info INT NOT NULL,
	FOREIGN KEY (id_info) REFERENCES informacion_clientes_personal(id)
);

CREATE TABLE especies (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL
);

CREATE TABLE razas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	id_especie INT NOT NULL,
	FOREIGN KEY (id_especie) REFERENCES especies(id)
);

CREATE TABLE mascotas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_cliente INT NOT NULL,
	nombre VARCHAR(255) NOT NULL,
	id_raza INT NOT NULL,
	edad_semanas INT,
	sexo ENUM('macho', 'hembra', 'desconocido') NOT NULL,
	estado_vital ENUM('activo', 'fallecido', 'extraviado') default 'activo',
	FOREIGN KEY (id_cliente) REFERENCES clientes(id),
	FOREIGN KEY (id_raza) REFERENCES razas(id)
);

CREATE TABLE antecedentes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_mascota INT NOT NULL,
    titulo varchar(100) NOT NULL,
	diagnostico TEXT NOT NULL,
	fecha_creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (id_mascota) REFERENCES mascotas(id)
);	

-- Tabla de los tratamiento de los antecedentes
CREATE TABLE antecedentes_tratamientos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    id_antecedente INT NOT NULL,
    titulo varchar(100) NOT NULL,
    descripcion TEXT NOT NULL,
    fecha_creado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_antecedente) REFERENCES antecedentes(id)
);

CREATE TABLE tipos_productos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(50) NOT NULL
);


CREATE TABLE productos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255) NOT NULL,
	precio DECIMAL NOT NULL,
	descripcion TEXT,
	fecha_caducidad DATETIME NOT NULL,
	id_tipo int,
	stock INT NOT NULL,
    FOREIGN KEY (id_tipo) REFERENCES tipos_productos(id)
);

	CREATE TABLE medicamentos_info (
		id INT AUTO_INCREMENT PRIMARY KEY,
		nombre VARCHAR(255) NOT NULL,              -- Nombre comercial del medicamento
		uso_general VARCHAR(255),                  -- ¿Para qué sirve? (dolor, infecciones, etc.)
		especie_destinada VARCHAR(100),            -- Ej: perro, gato, aves, todos
		via_administracion VARCHAR(100),           -- Ej: oral, inyectable
		presentacion VARCHAR(100),                 -- Ej: tabletas, jarabe, polvo, solución
		informacion_adicional TEXT                 -- Texto libre con cualquier cosa útil
	);

-- Medicamentos registrados en inventario
CREATE TABLE medicamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_info INT NOT NULL,
    precio DECIMAL NOT NULL,
    FOREIGN KEY (id_info) REFERENCES medicamentos_info(id)
);

CREATE TABLE lotes_medicamento (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_medicamento INT NOT NULL,
	fecha_caducidad DATE,
	cantidad INT NOT NULL,
	numero_lote VARCHAR(100),
	FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id)
);

CREATE TABLE medicamentos_tratamiento (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_tratamiento INT NOT NULL,
	id_medicamento_info INT NOT NULL, 
	dosis VARCHAR(100) DEFAULT 'No aplica',
	frecuencia_aplicacion VARCHAR(100),
	duracion INT,
	FOREIGN KEY (id_tratamiento) REFERENCES antecedentes_tratamientos(id),
    
    
	FOREIGN KEY (id_medicamento_info) REFERENCES medicamentos_info(id)
);


CREATE TABLE ventas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_cliente INT,
	fecha DATETIME NOT NULL,
	total DECIMAL(7,2) NOT NULL,	
    monto DECIMAL NOT NULL,
    estado ENUM('completada', 'pendiente'),
	FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE servicios(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(255) NOT NULL
    -- No tiene monto ya que va a ser cualitativo, no cuantitativo
);

CREATE TABLE detalles_ventas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_venta INT NOT NULL,
	id_producto INT, -- Medicamentos ID
    id_servicio INT,
    id_medicamento INT,
	cantidad INT NOT NULL,        
	subtotal DECIMAL(7,2) NOT NULL,
    FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id),
	FOREIGN KEY (id_venta) REFERENCES ventas(id),
    FOREIGN KEY (id_servicio) REFERENCES servicios(id),
	FOREIGN KEY (id_producto) REFERENCES productos(id)
);

CREATE TABLE mascotas_medicamentos_aviso(
	id INT AUTO_INCREMENT PRIMARY KEY,
    id_medicamento int NOT NULL, 
    id_mascota int NOT NULL,
    fecha_inicio datetime NOT NULL,
    fecha_fin datetime NOT NULL,
    frecuencia_aviso int NOT NULL,
    FOREIGN KEY (id_medicamento) REFERENCES medicamentos(id),
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id)
);

-- Insertar roles (admin y empleado)
INSERT INTO roles (nombre) VALUES
('admin'),
('empleado');

-- Insertar tipos de documento
INSERT INTO tipos_documento (nombre) VALUES
('Cédula de ciudadanía'),
('Tarjeta de identidad'),
('Cédula de extranjería');

-- Insertar información personal (referenciando id_tipo_documento)
INSERT INTO informacion_clientes_personal (id_tipo_documento, numero_documento, nombre, telefono, correo, direccion) VALUES
(1, '1234567890', 'Juan Pérez', '3001234567', 'juan@example.com', 'Calle 123 #45-67'),
(2, '9876543210', 'Laura Gómez', '3019876543', 'laura@example.com', 'Carrera 10 #20-30'),
(1, '1122334455', 'Carlos Ramírez', '3021122334', 'carlos@example.com', 'Diagonal 15 #33-12');

-- Insertar personal (relacionado con informacion_clientes_personal y roles)
-- Suponiendo: admin = id_rol 1, empleado = id_rol 2
INSERT INTO personal (id_info, id_rol, usuario, contrasena) VALUES
(1, 1, 'juanp', '1234admin'),     -- admin
(2, 2, 'laurag', '5678emp'),     -- empleado
(3, 2, 'carlosr', 'abcd1234'),   -- empleado
(1, 1, 'johan', 'johan123');     -- admin duplicado de prueba

-- Insertar clientes (usando ids de informacion_clientes_personal ya existentes)
INSERT INTO clientes (id_info) VALUES 
(1), -- Juan Pérez
(2), -- Laura Gómez
(3); -- Carlos Ramírez

-- Insertar especies
INSERT INTO especies (nombre) VALUES
('Perro'),
('Gato'),
('Conejo');

-- Insertar razas asociadas a especies
-- Suponiendo que: Perro = 1, Gato = 2, Conejo = 3
INSERT INTO razas (nombre, id_especie) VALUES
('Labrador Retriever', 1),
('Bulldog Francés', 1),
('Siames', 2),
('Persa', 2),
('Enano Holandés', 3);

-- Insertar mascotas asociadas a clientes y razas
-- Suponiendo que: clientes del 1 al 3 y razas del 1 al 5
INSERT INTO mascotas (id_cliente, nombre, id_raza, edad_semanas, sexo, estado_vital) VALUES
(1, 'Firulais', 1, 4, 'macho', 'activo'),
(2, 'Luna', 3, 2, 'hembra', 'activo'),
(3, 'Pelusa', 5, 1, 'hembra', 'activo'),
(1, 'Max', 2, 5, 'macho', 'activo'),
(2, 'Misha', 4, 3, 'hembra', 'activo');

use veterinaria_pipos;
select * from mascotas;

select * from tipos_documento;
select * from antecedentes;
select * from antecedentes_tratamientos;
select * from medicamentos_tratamiento;
INSERT INTO antecedentes (id_mascota, titulo, diagnostico)
VALUES 
(1, 'Otitis externa', 'Presencia de secreción y mal olor, probable otitis externa.'),
(1, 'Control de peso', 'Peso por encima del ideal para su raza y edad. Se recomienda dieta.'),
(1, 'Vacunación anual', 'Aplicación de vacunas obligatorias para el periodo.');

INSERT INTO antecedentes_tratamientos (id_antecedente, titulo, descripcion)
VALUES 
(2, 'Limpieza de oído', 'Se debe aplicar solución ótica cada 12 horas durante una semana.'),
(2, 'Antibiótico oral', 'Administrar amoxicilina 250mg cada 8 horas por 7 días.'),
(2, 'Cambio de alimentación', 'Iniciar dieta especial recomendada por el veterinario.'),
(3, 'Aplicación de vacuna', 'Se aplicó la vacuna contra la rabia.'),
(3, 'Refuerzo de vacuna', 'Programar refuerzo en 21 días.');

INSERT INTO medicamentos_info (
    nombre,
    uso_general,
    especie_destinada,
    via_administracion,
    presentacion,
    informacion_adicional
) VALUES
  ('Oticure', 'Tratamiento de infecciones del oído', 'perro', 'tópica', 'gotas', 'Aplicar directamente en el canal auditivo. Usar guantes.'),
  ('Vetramil', 'Cicatrizante y antibacteriano', 'gato', 'tópica', 'crema', 'Ideal para heridas externas. No usar en ojos.'),
  ('Baytril 5%', 'Antibiótico para infecciones bacterianas', 'todos', 'inyectable', 'solución', 'Aplicar vía subcutánea o intramuscular según indicación veterinaria.'),
  ('PetFlu Syrup', 'Control de fiebre y dolor', 'perro', 'oral', 'jarabe', 'Administrar con jeringa dosificadora. Agitar antes de usar.'),
  ('Amoxicilina 250mg', 'Antibiótico de amplio espectro', 'perro', 'oral', 'tabletas', 'No administrar en animales con alergia a penicilinas.');


INSERT INTO medicamentos_tratamiento (
  id_tratamiento,
  id_medicamento_info,
  dosis,
  frecuencia_aplicacion,
  duracion
) VALUES
  (11, 2, '10 mg', 'Cada 8 horas', 7),
  (11, 3, '5 gotas', 'Una vez al día', 5);
