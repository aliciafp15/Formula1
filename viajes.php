<?php

class Carrusel
{

    private $capital;
    private $pais;


    public function __construct($capital, $pais)
    {
        $this->capital = $capital;
        $this->pais = $pais;
    }


    /**Obtiene 10 fotos del país en cuestión */
    function obtenerImagenes()
    {
        $apiKey = '87cd7336be903190374dc6fef69b087f';
        $flickrAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search";

        $params = array(
            'api_key' => $apiKey,
            'tags' => $this->pais . ',' . $this->capital,
            'format' => 'json',
            'per_page' => 10,
            'nojsoncallback' => '1',
            'sort' => 'relevance',  // Ordenar por relevancia
        );

        $url = $flickrAPI . '&' . http_build_query($params);
        $respuesta = file_get_contents($url);
        $data = json_decode($respuesta, true);

        $carrusel = "<article data-element='carrusel'><h3>Carrusel de Italia</h3>";
        foreach ($data["photos"]["photo"] as $foto) {
            $titulo = $foto["title"];
            $URLfoto = "https://live.staticflickr.com/" . $foto["server"] . "/" . $foto["id"] . "_" . $foto["secret"] . "_b.jpg";
            $img = "<img data-element='carruselImg' alt='" . $titulo . "' src='" . $URLfoto . "' />";
            $carrusel .= $img;
        }
        $carrusel .= "<button onclick='viajes.fotoSiguiente()' data-action='next'> > </button>
      <button data-action='prev' onclick='viajes.fotoAnterior()'> < </button></article>";

        return $carrusel;
    }
}

class Moneda
{

    public $monedaOrigen; //EUR
    public $monedaDestino; //
    public function __construct($monedaOrigen, $monedaDestino)
    {
        $this->monedaOrigen = $monedaOrigen;
        $this->monedaDestino = $monedaDestino;
    }

    function cambioDeMoneda()
    {
        $key = 'bceb6a81c9022edfb7ed1aa06d69e3c3';
        $url = 'http://apilayer.net/api/live?access_key=' . $key . '&currencies=' . $this->monedaDestino . '&source=' . $this->monedaOrigen . '&format=1';

        $respuesta = file_get_contents($url);
        $data = json_decode($respuesta, true);

        // Comprobamos si la decodificación JSON fue exitosa
        if ($data) {
            // Imprimir o utilizar elementos específicos del array
            $cambio = $data['quotes']['USDEUR'];
        }

        $salida = "<h3>Cambio de divisa</h3>";
        $salida .= '<p>1 ' . $this->monedaOrigen . ' son ' . $cambio . ' ' . $this->monedaDestino . '</p>';
        return $salida;
    }
}
?>
<!DOCTYPE HTML>

<html lang="es">

<head>
    <!-- Datos que describen el documento -->
    <meta charset="UTF-8" />
    <title>F1 Desktop - Viajes</title> <!--Asegurarme de que el título les guste-->
    <meta name="author" content="Alicia Fernández Pushkina" />
    <meta name="description" content="documento para utilizar en otros módulos de la asignatura" />
    <meta name="keywords" content="html, css, index" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" /> <!--definir la ventana gráfica-->
    <link rel="stylesheet" type="text/css" href="estilo/estilo.css" />
    <link rel="stylesheet" type="text/css" href="estilo/layout.css" />
    <link rel="stylesheet" type="text/css" href="estilo/viajes.css" />
    <link rel="stylesheet" type="text/css" href="estilo/carrusel.css" />


    <link href="multimedia/imagenes/favicon.ico" rel="icon" />
    <script src="js/viajes.js"></script>
    <script src="https://code.jquery.com/jquery-3.7.1.min.js"
        integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo=" crossorigin="anonymous"></script>
    <link rel="stylesheet" href="https://api.mapbox.com/mapbox-gl-js/v2.11.0/mapbox-gl.css" />

    <!--mapa dnámico-->
    <link href="https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.css" rel="stylesheet">
    <script src="https://api.mapbox.com/mapbox-gl-js/v3.8.0/mapbox-gl.js"></script>



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
            <a href="viajes.php" class="active" title="Planificar tus viajes">Viajes</a>
            <a href="juegos.html" title="Explorar juegos">Juegos</a>
        </nav>
    </header>
    <p>Estás en: <a href="index.html" title="Volver al inicio">Inicio</a> >> Viajes</p>

    <main>
        <h2>Viajes</h2>
        <?php

        $carrusel = new Carrusel('Roma', 'Italia');
        echo $carrusel->obtenerImagenes();
        //<!-- cambio de divisa -->
        $moneda = new Moneda('USD', 'EUR');
        echo $moneda->cambioDeMoneda();
        ?>

        <section data-element="estatico">
            <h3>Mapa estático - Ubicación Actual</h3>
            <input type="button" value="Obtener mapa estático" onclick="viajes.cargarMapaEstatico();" />
        </section>

        <section>
            <h3>Mapa dinámico - Ubicación Actual</h3>
            <!-- mapa dinamico -->
            <div id="mapaDinamico"></div>
        </section>


        <script>
            var viajes = new Viajes();
        </script>
    </main>
</body>

</html>