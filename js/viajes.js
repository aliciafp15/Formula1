class Viajes {

    curSlide = 0; //la primera imagen del carrusel será la 0
    slides;

    constructor() {
        this.accessToken = 'pk.eyJ1IjoiYWxpY2lhZnAxNSIsImEiOiJjbGdzMnZweWowZWEyM2NvYWZkODMxZXpoIn0.ghWod73o3jm9F1lPOhfsjw'; // Reemplaza con tu token de Mapbox
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));

        this.slides = document.querySelectorAll("main>article>img");//reune las imagenes dle carrusel;


    }

    getPosicion(posicion) {
        this.mensaje = "Petición de geolocalización realizada con éxito";

        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.precision = posicion.coords.accuracy;
        this.altitud = posicion.coords.altitude;
        this.precisionAltitud = posicion.coords.altitudeAccuracy;
        this.rumbo = posicion.coords.heading;
        this.velocidad = posicion.coords.speed;

        this.tienePermiso = true;

        //this.getMapaDinamicoMapBox();
    }

    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización"
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible"
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado"
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido"
                break;
        }

        this.tienePermiso = false;
    }


    cargarMapaEstatico() {
        if (this.tienePermiso) {


            var mapaEstatico = document.createElement("img");

            var api_token = "pk.eyJ1IjoiYWxpY2lhZnAxNSIsImEiOiJjbTRidnpucmIwM3ZoMmpzOHdiYmg4ZjNjIn0.l-Ye9cgCVtEZRsouG2-zcA";
            var zoom = 15; // zoom: 1 (el mundo), 5 (continentes), 10 (ciudad), 15 (calles), 20 (edificios)
            var tamMapa = "600x500"; // se define el tamaño en pixeles
            var colorPin = "ff0000";

            var api_url = "https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/"
                + "pin-s+" + colorPin
                + "(" + this.longitud + "," + this.latitud + ")/"
                + this.longitud + ","
                + this.latitud + ","
                + zoom + ",0/"
                + tamMapa
                + "?access_token=" + api_token;



            mapaEstatico.setAttribute("src", api_url);
            mapaEstatico.setAttribute("alt", "Mapa geográfico de tu ubicación actual");

            var seccionEstatico = $("main > section:nth-of-type(1)");
            seccionEstatico.append(mapaEstatico);





        } else {
            var parrafoPermisoNoConcedido = document.createElement("p");
            var textoPermisoNoConcedido = document.createTextNode("Permiso de ubicación denegado, no se ha podido cargar el mapa estático");
            parrafoPermisoNoConcedido.appendChild(textoPermisoNoConcedido);
            document.querySelector("main").appendChild(parrafoPermisoNoConcedido);

            const parrafo = $('<p>');
            const mensaje = "<h3> Permiso de ubicación denegado</h3>"
            parrafo.append(mensaje);
        }

        //elimina el botón que obtiene el mapa
        document.querySelector("main > section:nth-of-type(1) input[type='button']").remove();

    }


    getMapaDinamicoMapBox() {
        var lng = parseFloat(this.longitud);
        var lat = parseFloat(this.latitud)
        //st = sk.eyJ1IjoiYWxpY2lhZnAxNSIsImEiOiJjbTRidzY3dDAwNHdhMndzYzFnaDdhNG92In0.8BMSzERGai1QdUdH90rlow
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpY2lhZnAxNSIsImEiOiJjbTRidnpucmIwM3ZoMmpzOHdiYmg4ZjNjIn0.l-Ye9cgCVtEZRsouG2-zcA';
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style: 'mapbox://styles/mapbox/streets-v12', // style URL
            center: [lng, lat], // starting position [lng, lat]
            zoom: 9,

        });
        // no necesito añadir el mapa al DOM si ya tengo el contenedor

        // añadir marcador de posicion
        const marker = new mapboxgl.Marker()
            .setLngLat([lng, lat])
            .addTo(map);
    }

  

    fotoSiguiente() {

        // maximum number of slides
        var maxSlide = 9;//son 10 imagenes, pero empiezo desde la 0


        // check if current slide is the last and reset current slide
        if (this.curSlide === maxSlide) {
            this.curSlide = 0;
        } else {
            this.curSlide++;
        }

        //   move slide by -100%
        this.slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });


    }

    fotoAnterior() {

        // maximum number of slides
        var maxSlide = 9;//son 10 imagenes, pero empiezo desde la 0


        // check if current slide is the last and reset current slide
        if (this.curSlide === 0) {
            this.curSlide = maxSlide;
        } else {
            this.curSlide--;
        }

        //   move slide by -100%
        this.slides.forEach((slide, indx) => {
            var trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });

    }








}