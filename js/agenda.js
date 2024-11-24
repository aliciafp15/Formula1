class Agenda{


    constructor(){
        this.apiURL = 'https://api.jolpi.ca/ergast/f1/2024/races'//info de las carreras de la temp en curso
        this.last_api_call = null; //momento temporal de la última petición a la API
        this.last_api_result = null; //última respuesta que ha dado la API a la consulta en cuestión (EN XML)
        this.intervalo = 10;
    }

    verCarreras(){
        
         // Comprobar si ha pasado el intervalo de tiempo desde la última llamada
        const ahora = new Date();
        const self = this;// Almacenar la referencia a esta clase
         if ( this.last_api_call !== null && (ahora - this.last_api_call) / (1000 * 60) < this.intervalo) {
             return this.last_api_result;// No ha pasado el intervalo de tiempo, devolver la última respuesta almacenada
         }

         // Realizar la solicitud AJAX a la API en formato XML
       
         $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: function(JSONRecuperado)
            {
                var carreras = JSONRecuperado.MRData.RaceTable.Races;
                
                $.each(carreras, function(i, carrera)
                {
                    var nombreCarrera = carrera.raceName;
                    var nombreCircuito = carrera.Circuit.circuitName;
                    var coordenadas = carrera.Circuit.Location;
                    var coordenadasLatitud = coordenadas.lat;
                    var coordenadasLongitud = coordenadas.long;
                    var fechaCarrera = carrera.date;
                    var horaCarrera = carrera.time.split("Z")[0];

                    var articulo = document.createElement("article");

                    //--------------------- Nombre de la carrera ---------------------//
                    var cabeceraNombreCarrera = document.createElement("h3");
                    var contenidoNombreCarrera = document.createTextNode("Nombre de la carrera");
                    cabeceraNombreCarrera.appendChild(contenidoNombreCarrera);
                    articulo.appendChild(cabeceraNombreCarrera);

                    var parrafoNombreCarrera = document.createElement("p");
                    contenidoNombreCarrera = document.createTextNode(nombreCarrera);
                    parrafoNombreCarrera.appendChild(contenidoNombreCarrera);
                    articulo.appendChild(parrafoNombreCarrera);


                    //--------------------- Nombre del circuito ---------------------//
                    var cabeceraNombreCircuito = document.createElement("h3");
                    var contenidoNombreCircuito = document.createTextNode("Nombre del circuito");
                    cabeceraNombreCircuito.appendChild(contenidoNombreCircuito);
                    articulo.appendChild(cabeceraNombreCircuito);

                    var parrafoNombreCircuito = document.createElement("p");
                    contenidoNombreCircuito = document.createTextNode(nombreCircuito);
                    parrafoNombreCircuito.appendChild(contenidoNombreCircuito);
                    articulo.appendChild(parrafoNombreCircuito);

                    //--------------------- Coordenadas del circuito ---------------------//
                    var cabeceraCoordenadas = document.createElement("h3");
                    var contenidoCoordenadas = document.createTextNode("Coordenadas del circuito");
                    cabeceraCoordenadas.appendChild(contenidoCoordenadas);
                    articulo.appendChild(cabeceraCoordenadas);

                    var parrafoCoordenadasLatitud = document.createElement("p");
                    var parrafoCoordenadasLongitud = document.createElement("p");
                    var contenidoCoordenadasLatitud = document.createTextNode("Latitud: " + coordenadasLatitud);
                    var contenidoCoordenadasLongitud = document.createTextNode("Longitud: " + coordenadasLongitud);
                    parrafoCoordenadasLatitud.appendChild(contenidoCoordenadasLatitud);
                    parrafoCoordenadasLongitud.appendChild(contenidoCoordenadasLongitud);
                    articulo.appendChild(parrafoCoordenadasLatitud);
                    articulo.appendChild(parrafoCoordenadasLongitud);


                    //--------------------- Fecha y hora de la carrera ---------------------//
                    var cabeceraFechaHora = document.createElement("h3");
                    var contenidoFechaHora = document.createTextNode("Fecha y hora de la carrera");
                    cabeceraFechaHora.appendChild(contenidoFechaHora);
                    articulo.appendChild(cabeceraFechaHora);

                    var parrafoFecha = document.createElement("p");
                    var parrafoHora = document.createElement("p");
                    var contenidoFecha = document.createTextNode(fechaCarrera);
                    var contenidoHora = document.createTextNode(horaCarrera);
                    parrafoFecha.appendChild(contenidoFecha);
                    parrafoHora.appendChild(contenidoHora);
                    articulo.appendChild(parrafoFecha);
                    articulo.appendChild(parrafoHora);

                    document.querySelector("body > main").appendChild(articulo);
                })
            },

            error: function()
            {
                alert("No se ha podido cargar el calendario de la F1");
            }
        });
    }

}