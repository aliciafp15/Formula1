class Agenda {


    constructor() {
        this.apiURL = 'https://api.jolpi.ca/ergast/f1/2024/races'//info de las carreras de la temp en curso


    }

    verCarreras() {



        $.ajax({
            dataType: "jso",
            url: this.apiURL,
            method: 'GET',
            success: function (data) {

                var carreras = data.MRData.RaceTable.Races;


                // Crear el contenedor principal de las carreras
                const section = $('<section>');
                const header = $('<h3>').text('Carreras');
                section.append(header);

                $.each(carreras, function (i, carrera) {
                    var nombreCarrera = carrera.raceName;
                    var nombreCircuito = carrera.Circuit.circuitName;
                    var coordenadas = carrera.Circuit.Location;
                    var lat = coordenadas.lat;
                    var long = coordenadas.long;
                    var fecha = carrera.date;
                    var hora = carrera.time.split("Z")[0];



                    // Crear el artículo para cada carrera
                    const article = $('<article>');

                    // Agregar contenido con un estilo similar al anterior
                    article.html(`
                        <h4>${nombreCarrera}</h4>
                        <p>Circuito: ${nombreCircuito}</p>
                        <p>Ubicación: (${lat}, ${long})</p>
                        <p>Fecha y Hora: ${fecha}, ${hora}</p>
                    `);

                    // Añadir el artículo a la sección
                    section.append(article);
                });

                // Insertar la sección en el documento
                $('body > main').append(section);

                //deshabilitar boton
                const button = document.querySelector("button")
                button.disabled = true
            },

            error: function () {
                var main = $("main");
                main.append("<p>No se ha podido cargar el calendario de la F1</p>");
            }
        });
    }

}


