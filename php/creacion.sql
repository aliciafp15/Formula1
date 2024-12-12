DROP TABLE IF EXISTS resultados;
DROP TABLE IF EXISTS carreras;
DROP TABLE IF EXISTS circuitos;
DROP TABLE IF EXISTS pilotos;
DROP TABLE IF EXISTS equipos;

CREATE TABLE equipos (
  equipo_id VARCHAR(100) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  pais VARCHAR(100) NOT NULL,
  jefe_equipo VARCHAR(100) NOT NULL
);

CREATE TABLE pilotos (
  piloto_id VARCHAR(100) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  fecha_nacimiento DATE NOT NULL,
  nacionalidad VARCHAR(100) NOT NULL,
  equipo_id VARCHAR(100),
  FOREIGN KEY (equipo_id) REFERENCES equipos(equipo_id)
);

CREATE TABLE circuitos (
  circuito_id VARCHAR(100) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  pais VARCHAR(100) NOT NULL,
  longitud_km DECIMAL(5,2) NOT NULL
);

CREATE TABLE carreras (
  carrera_id VARCHAR(100) PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  fecha DATE NOT NULL,
  circuito_id VARCHAR(100),
  FOREIGN KEY (circuito_id) REFERENCES circuitos(circuito_id)
);

CREATE TABLE resultados (
  resultado_id VARCHAR(100) PRIMARY KEY,
  carrera_id VARCHAR(100),
  piloto_id VARCHAR(100),
  posicion INT NOT NULL,
  tiempo VARCHAR(100) NOT NULL,
  puntos INT NOT NULL,
  FOREIGN KEY (carrera_id) REFERENCES carreras(carrera_id),
  FOREIGN KEY (piloto_id) REFERENCES pilotos(piloto_id)
);
