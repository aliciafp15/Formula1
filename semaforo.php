<?php
class Record
{
  private $server;
  private $user;
  private $pass;
  private $dbname;
  public $mensaje = "";
  public $tiempo;
  public  $nombreP;
  public $apellidosP;
  public $nivel;

  private $clasificacion;

  public function __construct()
  {
    $this->server = "localhost";
    $this->user = "DBUSER2024";
    $this->pass = "DBPSWD2024";
    $this->dbname = "records";
  }


  function conectarBD()
  {
    $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

    if ($db->connect_errno) {
      $this->mensaje = "Error de conexión: " . $db->connect_error;
    } else {
      $consultaPreparada = $db->prepare("INSERT INTO registro (nombre, apellidos, nivel, tiempo) VALUES (?,?,?,?);"); //consulta de creación
      $consultaPreparada->bind_param('ssss', $this->nombreP, $this->apellidosP, $this->nivel, $this->tiempo);
      //ejecutar sentencia
      $consultaPreparada->execute();
      // mostrar mensaje
      if ($consultaPreparada->affected_rows > 0) {
        $this->mensaje = "<h4>Tiempo registrado</h4>";
      }
      $consultaPreparada->close();
      $db->close();
    }
  }



  function mostrarRanking()
  {
    $db = new mysqli($this->server, $this->user, $this->pass, $this->dbname);

    if ($db->connect_errno) {
      echo "Error de conexión: " . $db->connect_error;
    } else {
      //preparar la consulta
      $consultaPreparada = $db->prepare("SELECT * FROM registro WHERE nivel LIKE ? ORDER BY tiempo ASC LIMIT 10;");
      $consultaPreparada->bind_param('s', $this->nivel);
      $consultaPreparada->execute();

      $resultado = $consultaPreparada->get_result();
      if ($resultado->fetch_assoc() != NULL) {
        $resultado->data_seek(0); // se posiciona al inicio del resultado de la búsqueda
        $this->clasificacion .= "<ol>";
        while ($fila = $resultado->fetch_assoc()) {
          $this->clasificacion .= "<li>" . $fila['nombre'] . " " . $fila['apellidos'] . " ~ " . $fila['nivel'] . " ~ " . $fila["tiempo"] . "segundos </li>";
        }
        $this->clasificacion .= "</ul>";
      } //si no hay elementos en la base de datos, es que no se ha guardado ninguna persona en el formulario, por lo que no se muestra
      $consultaPreparada->close();
      $db->close();
    }
  }
  function mostrarClasificacion()
  {
    if ($this->clasificacion != "") {
      echo $this->clasificacion;
    }
  }
}
$registro = new Record();
//asegura que la consulta se ejecute solo cuando se envíe el formulario
if (count($_POST) > 0) {
  $registro->nombreP = $_POST["nombre"];
  $registro->apellidosP = $_POST["apellidos"];
  $registro->nivel = $_POST["nivel"];
  $registro->tiempo = $_POST["tiempo"];
  //conectarse y mostrar el ranking
  $registro->conectarBD();
  $registro->mostrarRanking();
}
?>


<!DOCTYPE HTML>

<html lang="es">

<head>
  <!-- Datos que describen el documento -->
  <meta charset="UTF-8" />
  <title>F1 Desktop - Memoria</title> <!--Asegurarme de que el título les guste-->
  <meta name="author" content="Alicia Fernández Pushkina" />
  <meta name="description" content="documento para utilizar en otros módulos de la asignatura" />
  <meta name="keywords" content="html, css, index" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <!--definir la ventana gráfica-->
  <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
  <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
  <link rel="stylesheet" type="text/css" href="estilo/semaforo_grid.css" />
  <script src="https://code.jquery.com/jquery-3.7.1.min.js"
    integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
  <link href="multimedia/imagenes/favicon.ico" rel="icon" />
  <script src="js/semaforo.js"></script>
</head>

<body>
  <header>
    <!-- Datos con el contenidos que aparece en el navegador -->
    <h1><a href="index.html" title="Volver al inicio">F1 Desktop</a></h1>
    <nav>
      <a href="index.html" title="Volver a la página de inicio">Index</a>
      <a href="piloto.html" title="Ver información sobre el piloto">Piloto</a>
      <a href="noticias.html" title="Leer las últimas noticias">Noticias</a>
      <a href="calendario.html" title="Consultar el calendario">Calendario</a>
      <a href="meteorologia.html" title="Revisar la meteorología">Meteorología</a>
      <a href="circuito.html" title="Información sobre el circuito">Circuito</a>
      <a href="viajes.html" title="Planificar tus viajes">Viajes</a>
      <a href="juegos.html" class="active" title="Explorar juegos">Juegos</a>
    </nav>

  </header>
  <p>Estás en: <a href="index.html" title="Volver al inicio">Inicio</a> >> <a href="juegos.html" title="Volver a ver los juegos">Juegos</a> >> Semáforo</p>
  <!--menu de juegos-->
  <section>
    <h2>Juegos</h2>
    <nav>
      <a href="memoria.html" title="Ir al juego de memoria">Memoria</a>
      <a href="semaforo.html" title="Ir al juego del semáforo">Semáforo</a>
      <a href="api.html" title="Ir al juego de la API">API</a>
    </nav>
  </section>

  <main>
  </main>

  <!-- codigo php para mostrar la clasificación -->
  <?php echo $registro->mensaje ?>
  <?php $registro->mostrarClasificacion() ?>

  <script>
    var juego = new Semaforo();
  </script>
</body>

</html>