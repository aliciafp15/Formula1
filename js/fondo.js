class Fondo{
    constructor(pais, capital, nombreCircuito){
        this.pais = pais;
        this.capital = capital;
        this.nombreCircuito = nombreCircuito;

    }



    buscaFoto() {
        // Configura la URL de la API de Flickr
        const apiKey = '87cd7336be903190374dc6fef69b087f';
        const flickrAPI = "https://www.flickr.com/services/rest/?method=flickr.photos.search";


        const conf = {
            // method: 'flickr.photos.search',
            "api_key": apiKey,
            "format": 'json',
            tags: `${this.nombreCircuito}, ${this.pais}, ${this.capital}, f1`,
            "lat": 45.618978, 
            "lon": 9.281183,
            radius: 1,
            "nojsoncallback": "1",
            accuracy: 16, // Solo fotos con ubicación precisa


        };


        $.getJSON(flickrAPI,conf)
        .done(function (data) {
            var foto = data["photos"]["photo"][0];
            var url = "https://live.staticflickr.com/" + foto["server"] + "/" + foto["id"]
                    + "_" + foto["secret"] + "_b.jpg";


            // // establecer la imaegn paar que ocupe toda la pantalla
            // $('body').css('background-image', url)
            // .css('background-size', 'cover');

            $("body").css("background", "no-repeat url(" + url + ")  center center fixed")
                    .css('background-size', 'cover');
        })
        .fail(function (error) {
            console.error('Error en la solicitud AJAX:', error);
            console.error('Error en la solicitud AJAX:', error.responseText);

        });

    }

}