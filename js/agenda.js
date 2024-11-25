class Agenda{


    constructor(){
        this.apiURL = 'https://api.jolpi.ca/ergast/f1/2024/races'//info de las carreras de la temp en curso


    }

    verCarreras(){
        

       
         $.ajax({
            dataType: "json",
            url: this.apiURL,
            method: 'GET',
            success: function(data)
            { 
        
                var carreras = data.MRData.RaceTable.Races;

        
                // Crear el contenedor principal de las carreras
                const section = $('<section>');
                section.html('<h3>Carreras</h3>');
        
                $.each(carreras, function(i, carrera){
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
                        <p><strong>Circuito:</strong> ${nombreCircuito}</p>
                        <p><strong>Ubicación:</strong> (${lat}, ${long})</p>
                        <p><strong>Fecha y Hora:</strong> ${fecha}, ${hora}</p>
                    `);
        
                    // Añadir el artículo a la sección
                    section.append(article);
                });
        
                // Insertar la sección en el documento
                $('body > main').append(section);
            },

            error: function () {
                alert("No se ha podido cargar el calendario de la F1");
            }
        });
    }

}

