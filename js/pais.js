class Pais {

    constructor(nombre, capital, poblacion) {
        this.nombre = nombre;
        this.capital = capital;
        this.poblacion = poblacion;
    }

    setGobierno(gobierno) {
        this.gobierno = gobierno;
    }

    setReligion(religion) { //mayoritaria
        this.religion = religion;
    }

    setCoordenadas(latitud, longitud) { //de la linea de meta
        this.latitud = latitud;
        this.longitud = longitud;

    }


    setCircuito(circuito) {
        this.circuito = circuito;
    }

    rellenarAtributos(nombreCircuito, gobierno, latitud, longitud, religion) {
        this.nombreCircuito = nombreCircuito;
        this.gobierno = gobierno;
        this.latitud = latitud;
        this.longitud = longitud;
        this.religion = religion;
    }


    getNombre() {
        return this.nombre;
    }

    getCapital() {
        return this.capital;
    }

    obtenerInfoSecundaria() {
        let infoSecundaria = `
            <ul>
                <li>Nombre del Circuito: ${this.nombreCircuito}</li>
                <li>Población: ${this.poblacion}</li>
                <li>Forma de Gobierno: ${this.gobierno}</li>
                <li>Religión Mayoritaria:${this.religion}</li>
            </ul>
        `;
        return infoSecundaria;
    }

    obtenerCoordenadas() {
        return `Coordenadas de la línea de meta del circuito: (${this.latitud}, ${this.longitud})`;
    }


    // previsión del tiempo en la línea de meta del circuito para los próximos 5 días.
    //devuelva la información del tiempo en formato JSON y con unidades de medida del sistema métrico
    mirarTiempo() {
        const apiKey = '533fd228654cbc50777660297ddc9c40';
        const url = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.latitud}&lon=${this.longitud}&units=metric&appid=${apiKey}`;

        $.ajax({
            url: url,
            type: 'GET',
            dataType: 'json',
            success: function (data) {
                const filteredList = data.list.filter(item => item.dt_txt.includes('12:00:00'));

                const section = $('<section>');// una seccion que contenga 5 articulos
                const header = $('<h3>').text('Tiempo en la linea de meta de Monza para los próximos 5 días');
                section.append(header);


                filteredList.forEach(item => {
                    // Crear un bloque article para cada día
                    const dayArticle = $('<article>');

                    // Obtener los valores requeridos y asignar 0 si rain no está presente
                    var tempMax = item.main.temp_max || 0;
                    var tempMin = item.main.temp_min || 0;
                    var humidity = item.main.humidity || 0;
                    var rain = item.rain ? item.rain['3h'] : 0;

                    var aux = item.dt_txt.split(" ");
                    var fecha = aux[0];


                    // Obtener la URL base para los iconos y agregar el nombre del icono
                    const iconUrlBase = 'https://openweathermap.org/img/wn/';
                    const iconUrl = `${iconUrlBase}${item.weather[0].icon}.png`;

                    // Agregar elementos al bloque del día
                    dayArticle.html(`
                        <h4>${fecha}</h4>
                        <p>Temp. Máxima: ${tempMax}°C</p>
                        <p>Temp. Mínima: ${tempMin}°C</p>
                        <p>Humedad: ${humidity}%</p>
                        <p>Lluvia: ${rain} mm</p>
                        <img src="${iconUrl}" alt="Icono del tiempo">
                    `);

                    section.append(dayArticle);
                });

                $('main').append(section);
            },
            error: function (error) {
                console.error(error);
            }
        });
    }

}