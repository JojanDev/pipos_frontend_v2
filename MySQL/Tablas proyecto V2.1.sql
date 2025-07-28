drop database if exists veterinaria_pipos;
create database veterinaria_pipos;
use veterinaria_pipos;

CREATE TABLE tipos_documento (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255)
);

CREATE TABLE informacion_clientes_personal (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_tipo_documento INT,
	numero_documento VARCHAR(50),
	nombre VARCHAR(255),
	telefono VARCHAR(20),
	correo VARCHAR(255),
	direccion VARCHAR(255),
	FOREIGN KEY (id_tipo_documento) REFERENCES tipos_documento(id)
);

CREATE TABLE personal (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_info INT,
	contrasena VARCHAR(255),
	roles ENUM('admin', 'empleado') NOT NULL,
	FOREIGN KEY (id_info) REFERENCES informacion_clientes_personal(id)
);

CREATE TABLE clientes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_info INT,
	FOREIGN KEY (id_info) REFERENCES informacion_clientes_personal(id)
);

CREATE TABLE especies (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255)
);

CREATE TABLE razas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255),
	id_especie INT,
	FOREIGN KEY (id_especie) REFERENCES especies(id)
);

CREATE TABLE mascotas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_cliente INT,
	nombre VARCHAR(255),
	id_raza INT,
	edad INT,
	sexo ENUM('macho', 'hembra') NOT NULL,
	estado_vital ENUM('activo', 'fallecido', 'extraviado'),
	FOREIGN KEY (id_cliente) REFERENCES clientes(id),
	FOREIGN KEY (id_raza) REFERENCES razas(id)
);

CREATE TABLE antecedentes (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_mascota INT,
	diagnositco TEXT,
	tratamiento TEXT,
	fecha_creado DATETIME,
	FOREIGN KEY (id_mascota) REFERENCES mascotas(id)
);

-- Tabla de los tratamiento de los antecedentes
CREATE TABLE antecedentes_tratamientos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    id_antecedente INT,
    FOREIGN KEY (id_antecedente) REFERENCES antecedentes(id)
);

CREATE TABLE tipos_productos(
	id INT AUTO_INCREMENT PRIMARY KEY,
    nombre varchar(50)
);


CREATE TABLE productos (
	id INT AUTO_INCREMENT PRIMARY KEY,
	nombre VARCHAR(255),
	precio DECIMAL(7,2),
	descripcion TEXT,
	fecha_caducidad DATETIME,
	id_tipo int,
	stock INT,
    FOREIGN KEY (id_tipo) REFERENCES tipos_productos(id)
);

CREATE TABLE productos_tratamiento(
	id INT AUTO_INCREMENT PRIMARY KEY,
    id_tratamiento INT,
    id_producto INT,
    duracion_aplicado int,
    frecuencia_aplicado int,
    FOREIGN KEY (id_tratamiento) REFERENCES antecedentes_tratamientos(id),
    FOREIGN KEY (id_producto) REFERENCES productos(id)
);

CREATE TABLE ventas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_cliente INT,
	fecha DATETIME,
	total DECIMAL(7,2),
	FOREIGN KEY (id_cliente) REFERENCES clientes(id)
);

CREATE TABLE detalles_ventas (
	id INT AUTO_INCREMENT PRIMARY KEY,
	id_venta INT,
	id_producto INT,
	cantidad INT,
	subtotal DECIMAL(7,2),
	FOREIGN KEY (id_venta) REFERENCES ventas(id),
	FOREIGN KEY (id_producto) REFERENCES productos(id)
);

CREATE TABLE mascotas_productos_aviso(
	id INT AUTO_INCREMENT PRIMARY KEY,
    id_producto int, 
    id_mascota int,
    fecha_inicio datetime,
    fecha_fin datetime,
    frecuencia_aviso int,
    FOREIGN KEY (id_producto) REFERENCES productos(id),
    FOREIGN KEY (id_mascota) REFERENCES mascotas(id)
);

show tables;