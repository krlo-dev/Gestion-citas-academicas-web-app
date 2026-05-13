CREATE DATABASE IF NOT EXISTS citas_academicas;
USE citas_academicas;

-- Catálogos (como estado y tipo_usuario en el taller)
CREATE TABLE roles (
  id INT AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL,
  CONSTRAINT pk_rol PRIMARY KEY (id),
  CONSTRAINT uq_rol_nombre UNIQUE (nombre)
);

CREATE TABLE materias (
  id INT AUTO_INCREMENT,
  nombre VARCHAR(100) NOT NULL,
  CONSTRAINT pk_materia PRIMARY KEY (id)
);

CREATE TABLE estado_cita (
  id INT AUTO_INCREMENT,
  nombre VARCHAR(30) NOT NULL,
  CONSTRAINT pk_estado_cita PRIMARY KEY (id),
  CONSTRAINT uq_estado_cita_nombre UNIQUE (nombre)
);

-- Entidades principales
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT,
  nombre VARCHAR(120) NOT NULL,
  email VARCHAR(100) NOT NULL,
  password VARCHAR(255) NOT NULL,
  id_rol INT NOT NULL,
  CONSTRAINT pk_usuario PRIMARY KEY (id),
  CONSTRAINT uq_usuario_email UNIQUE (email),
  CONSTRAINT fk_usuario_rol FOREIGN KEY (id_rol) REFERENCES roles(id)
);

CREATE TABLE horarios_docente (
  id INT AUTO_INCREMENT,
  id_docente INT NOT NULL,
  id_materia INT NOT NULL,
  dia_semana ENUM('Lunes','Martes','Miércoles','Jueves','Viernes') NOT NULL,
  hora_inicio TIME NOT NULL,
  hora_fin TIME NOT NULL,
  CONSTRAINT pk_horario PRIMARY KEY (id),
  CONSTRAINT fk_horario_docente FOREIGN KEY (id_docente) REFERENCES usuarios(id),
  CONSTRAINT fk_horario_materia FOREIGN KEY (id_materia) REFERENCES materias(id)
);

CREATE TABLE citas (
  id INT AUTO_INCREMENT,
  id_estudiante INT NOT NULL,
  id_horario INT NOT NULL,
  fecha DATE NOT NULL,
  motivo VARCHAR(255),
  id_estado INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pk_cita PRIMARY KEY (id),
  CONSTRAINT fk_cita_estudiante FOREIGN KEY (id_estudiante) REFERENCES usuarios(id),
  CONSTRAINT fk_cita_horario FOREIGN KEY (id_horario) REFERENCES horarios_docente(id),
  CONSTRAINT fk_cita_estado FOREIGN KEY (id_estado) REFERENCES estado_cita(id)
);

-- Datos iniciales
INSERT INTO roles (nombre) VALUES ('Administrador'), ('Docente'), ('Estudiante');
INSERT INTO estado_cita (nombre) VALUES ('Pendiente'), ('Confirmada'), ('Cancelada');
INSERT INTO materias (nombre) VALUES ('Desarrollo Web'), ('Base de Datos'), ('Programación');
INSERT INTO usuarios (nombre, email, password, id_rol) 
VALUES ('Administrador', 'admin@edu.co', 'password', 1);