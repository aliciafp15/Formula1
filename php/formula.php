<?php
class Formula1
{
    private $server;
    private $user;
    private $pass;
    private $dbname;
    public $mensaje = "";

    public function __construct()
    {
        $this->server = "localhost";
        $this->user = "DBUSER2024";
        $this->pass = "DBPSWD2024";
        $this->dbname = "formula";
    }

    function init()
    {
        $db = new mysqli($this->server, $this->user, $this->pass);

        if ($db->connect_errno) {
            $this->mensaje = "Error de conexión: " . $db->connect_error;
        } else {
            // Crear la base de datos si no existe
            $sql_create_db = "CREATE DATABASE IF NOT EXISTS " . $this->dbname;
            if ($db->query($sql_create_db) === TRUE) {
                $this->mensaje .= "Base de datos creada exitosamente.";
            } else {
                $this->mensaje .= "Error al crear la base de datos: " . $db->error;
            }

            // Seleccionar la base de datos
            mysqli_select_db($db, $this->dbname);

            // Leer el contenido del archivo creacion.sql
            $sqlFile = file_get_contents('creacion.sql');

            // Ejecutar el contenido del archivo SQL (creación de tablas)
            if ($db->multi_query($sqlFile)) {
                $this->mensaje .= "Tablas creadas exitosamente.";
            } else {
                $this->mensaje .= "Error al crear las tablas: " . $db->error;
            }

            $db->close();
        }
    }

    public function importarCSV($archivo)
    {
        if (empty($archivo)) {
            $this->mensaje .= "No se ha seleccionado ningún archivo CSV.";
            return; // Si no se selecciona un archivo, sale del método
        }
        
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);
        $selectedTabla = "";
        ini_set("auto_detect_line_endings", true);

        if (($handle = fopen($archivo, 'r')) !== false) {
            // Leer los datos del archivo CSV e insertarlos en las tablas
            while (($fila = fgetcsv($handle, 2000, ",")) !== false) {
                // Verificar a qué tabla pertenece la fila
                $tabla = $fila[0];
                if ($tabla == 'equipo_id') {
                    $selectedTabla = "equipos";
                } else if ($tabla == 'piloto_id') {
                    $selectedTabla = "pilotos";
                } else if ($tabla == 'circuito_id') {
                    $selectedTabla = "circuitos";
                } else if ($tabla == 'carrera_id') {
                    $selectedTabla = "carreras";
                } else if ($tabla == 'resultado_id') {
                    $selectedTabla = "resultados";
                } else {
                    switch ($selectedTabla) {
                        case "equipos":
                            $stmt = $db->prepare('INSERT INTO equipos (equipo_id, nombre, pais, jefe_equipo) VALUES (?, ?, ?, ?)');
                            $stmt->bind_param('ssss', $fila[0], $fila[1], $fila[2], $fila[3]);
                            $stmt->execute();
                            $stmt->close();
                            break;

                        case "pilotos":
                            $stmt = $db->prepare('INSERT INTO pilotos (piloto_id, nombre, apellido, fecha_nacimiento, nacionalidad, equipo_id) VALUES (?, ?, ?, ?, ?, ?)');
                            $stmt->bind_param('ssssss', $fila[0], $fila[1], $fila[2], $fila[3], $fila[4], $fila[5]);
                            $stmt->execute();
                            $stmt->close();
                            break;

                        case "circuitos":
                            $stmt = $db->prepare('INSERT INTO circuitos (circuito_id, nombre, pais, longitud_km) VALUES (?, ?, ?, ?)');
                            $stmt->bind_param('ssss', $fila[0], $fila[1], $fila[2], $fila[3]);
                            $stmt->execute();
                            $stmt->close();
                            break;

                        case "carreras":
                            $stmt = $db->prepare('INSERT INTO carreras (carrera_id, nombre, fecha, circuito_id) VALUES (?, ?, ?, ?)');
                            $stmt->bind_param('ssss', $fila[0], $fila[1], $fila[2], $fila[3]);
                            $stmt->execute();
                            $stmt->close();
                            break;

                        case "resultados":
                            $stmt = $db->prepare('INSERT INTO resultados (resultado_id, carrera_id, piloto_id, posicion, tiempo, puntos) VALUES (?, ?, ?, ?, ?, ?)');
                            $stmt->bind_param('ssssss', $fila[0], $fila[1], $fila[2], $fila[3], $fila[4], $fila[5]);
                            $stmt->execute();
                            $stmt->close();
                            break;
                    }
                }
            }
            $db->close();
            // Cerrar el archivo CSV
            fclose($handle);
        } else {
            $this->mensaje .= "Error al abrir el archivo CSV";
        }
    }

    public function exportarCSV()
    {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        $csvFile = 'exportacion.csv';
        // Establecer encabezados para la descarga
        header('Content-Type: text/csv');
        header('Content-Disposition: attachment; filename="' . $csvFile . '"');
        // Abrir el archivo CSV para escritura
        $file = fopen('php://output', 'w');

        // Exportar datos de la tabla equipos
        fputcsv($file, array('equipo_id', 'nombre', 'pais', 'jefe_equipo'));
        $query_equipos = "SELECT * FROM equipos";
        $result_equipos = $db->query($query_equipos);
        if ($result_equipos->num_rows > 0) {
            while ($row = $result_equipos->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }

        // Exportar datos de la tabla pilotos
        fputcsv($file, array('piloto_id', 'nombre', 'apellido', 'fecha_nacimiento', 'nacionalidad', 'equipo_id'));
        $query_pilotos = "SELECT * FROM pilotos";
        $result_pilotos = $db->query($query_pilotos);
        if ($result_pilotos->num_rows > 0) {
            while ($row = $result_pilotos->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }

        // Exportar datos de la tabla circuitos
        fputcsv($file, array('circuito_id', 'nombre', 'pais', 'longitud_km'));
        $query_circuitos = "SELECT * FROM circuitos";
        $result_circuitos = $db->query($query_circuitos);
        if ($result_circuitos->num_rows > 0) {
            while ($row = $result_circuitos->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }

        // Exportar datos de la tabla carreras
        fputcsv($file, array('carrera_id', 'nombre', 'fecha', 'circuito_id'));
        $query_carreras = "SELECT * FROM carreras";
        $result_carreras = $db->query($query_carreras);
        if ($result_carreras->num_rows > 0) {
            while ($row = $result_carreras->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }

        // Exportar datos de la tabla resultados
        fputcsv($file, array('resultado_id', 'carrera_id', 'piloto_id', 'posicion', 'tiempo', 'puntos'));
        $query_resultados = "SELECT * FROM resultados";
        $result_resultados = $db->query($query_resultados);
        if ($result_resultados->num_rows > 0) {
            while ($row = $result_resultados->fetch_assoc()) {
                fputcsv($file, $row);
            }
        }

        // Cerrar el archivo y la conexión a la base de datos
        fclose($file);
        $db->close();
        exit;
    }

    public function rankingPilotos()
    {
        $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

        // Consulta para obtener el ranking de pilotos basado en los puntos
        $query = "
        SELECT p.piloto_id, p.nombre, p.apellido, SUM(r.puntos) AS puntos_totales
        FROM pilotos p
        JOIN resultados r ON p.piloto_id = r.piloto_id
        GROUP BY p.piloto_id
        ORDER BY puntos_totales DESC";


        $result = $db->query($query);
        if ($result->num_rows > 0) {
            $tabla = "<section><h3>Ranking de Pilotos</h3><table><tr><th>Posición</th><th>Nombre</th><th>Puntos Totales</th></tr>";
            $posicion = 1;
            while ($row = $result->fetch_assoc()) {
                $tabla .= "<tr><td>" . $posicion++ . "</td><td>" . $row['nombre'] . " " . $row['apellido'] . "</td><td>" . $row['puntos_totales'] . "</td></tr>";
            }
            $tabla .= "</table></section>";
            echo $tabla;
        } else {
            echo "No se encontraron datos.";
        }

        $db->close();
    }

    /**consulta para listar las posiciones de la primera carrera, la de Bahrein
     * SELECT r.posicion,p.apellido, p.nombre , e.nombre AS equipo FROM resultados r JOIN pilotos p ON r.piloto_id = p.piloto_id JOIN equipos e ON p.equipo_id = e.equipo_id WHERE r.carrera_id = 1 ORDER BY r.posicion;
     */
}

$formula1 = new Formula1();
if (isset($_POST['init'])) {
    $formula1->init();
}
if (isset($_POST['importarCSV'])) {
    $formula1->importarCSV($_FILES['importarCSV']['tmp_name']);
}
if (isset($_POST['exportarCSV'])) {
    $formula1->exportarCSV();
}


?>


<!DOCTYPE HTML>
<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8">
    <title>F1 Desktop - Coches</title> <!--Asegurarme de que el título les guste-->
    <meta name="author" content="Alicia Fernández Pushkina">
    <meta name="description" content="Documento inicial del F1 Desktop">
    <meta name="keywords" content="html, css, index">
    <meta name="viewport" content="width=device-width, initial-scale=1.0"> <!--definir la ventana gráfica-->
    <link rel="stylesheet" type="text/css" href="../estilo/estilo.css">
    <link rel="stylesheet" type="text/css" href="../estilo/layout.css">
    <link rel="stylesheet" type="text/css" href="../estilo/formula.css">


    <link href="../multimedia/imagenes/favicon.ico" rel="icon">



</head>

<body>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <header>
        <h1><a href="index.html" title="Volver al inicio">F1 Desktop</a></h1>
        <nav>
            <a href="index.html" title="Volver a la página de inicio">Index</a>
            <a href="piloto.html" title="Ver información sobre el piloto">Piloto</a>
            <a href="noticias.html" title="Leer las últimas noticias">Noticias</a>
            <a href="calendario.html" title="Consultar el calendario">Calendario</a>
            <a href="meteorologia.html" title="Revisar la meteorologia">Meteorologia</a>
            <a href="circuito.html" title="Información sobre el circuito">Circuito</a>
            <a href="viajes.php" title="Planificar tus viajes">Viajes</a>
            <a href="juegos.html" class="active" title="Explorar juegos">Juegos</a>
        </nav>
    </header>

    <p>Estás en: <a href="index.html" title="Volver al inicio">Inicio</a> >> <a href="juegos.html"
            title="Volver a ver los juegos">Juegos</a> >> Formula</p>
    <!--menu de juegos-->
    <section>
        <h2>Juegos</h2>
        <nav>
            <a href="memoria.html" title="Ir al juego de memoria">Memoria</a>
            <a href="semaforo.php" title="Ir al juego del semáforo">Semáforo</a>
            <a href="api.html" title="Ir al juego de los coches">Coches</a>
            <a href="formula.html" title="Ir al juego de la formula">Formula</a>

        </nav>
    </section>
    <main>

        <h3>Formula</h3>

        <form action="#" method="post">
            <label for="init">Crear BD o resetear</label>
            <input id="init" type="submit" name="init" value="Aceptar">
        </form>

        <form action="#" method="post" enctype="multipart/form-data">
            <label for="importarCSV">Importar datos</label>
            <input id="importarCSV" name="importarCSV" type="file" accept=".csv">
            <input type="submit" name="importarCSV" value="Importar">
        </form>

        <form action="#" method="post">
            <label for="exportarCSV">Exportar datos</label>
            <input id="exportarCSV" type="submit" name="exportarCSV" value="Exportar">
        </form>

        <form action="#" method="post">
            <label for="rankingPilotos">Ver los mejores pilotos</label>
            <input id="rankingPilotos" type="submit" name="rankingPilotos" value="Buscar">
        </form>

        <?php

        if (isset($_POST['rankingPilotos'])) {
            // leer bd y rellenar csv
            $formula1->rankingPilotos();
        }
        ?>
    </main>



</body>

</html>