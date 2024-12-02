class Circuito {

    constructor() {
        this.accessToken = 'pk.eyJ1IjoiYWxpY2lhZnAxNSIsImEiOiJjbGdzMnZweWowZWEyM2NvYWZkODMxZXpoIn0.ghWod73o3jm9F1lPOhfsjw'; // Reemplaza con tu token de Mapbox

    }


    procesarXml(files) {
        const file = files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                const contenidoXml = e.target.result;
                const contenidoHtml = this.parsearXmlAHtml(contenidoXml);
                $("main>section[data-element='zonaXML']").append(contenidoHtml);


            };

            reader.readAsText(file);
        }
    }

    parsearXmlAHtml(contenidoXml) {
        const xmlDoc = $.parseXML(contenidoXml);
        const $xml = $(xmlDoc);
        console.log($xml)

        let html = "";

        // Extraer los datos principales del circuito
        const datos = $xml.find("datos");
        const nombre = datos.find("nombre").text();
        const longitud = datos.find("longitud").text();
        const anchuraMed = datos.find("anchuraMed").text();
        const fecha = datos.find("fecha").text();
        const hora = datos.find("hora").text();
        const nVueltas = datos.find("nVueltas").text();
        const localidad = datos.find("localidad").text();
        const pais = datos.find("pais").text();

        // Procesar las referencias como enlaces <a>
        var cont = 1;
        const referencias = datos.find("referencias referencia").map(function () {
            const url = $(this).text();
            const title = `Referencia ${cont}`;  // Título dinámico con el valor de cont
            cont++;  // Incrementar el contador para la siguiente referencia
            return `<li><a href="${url}" title="${title}">${url}</a></li>`;
        }).get().join("");


        

        // Procesar las fotografías como múltiples <img>
        const fotos = datos.find("fotografias foto").map(function () {
            const url = $(this).text();
            return url
                ? `<img src="multimedia/imagenes/${url}" alt="Fotografía del circuito ${nombre}" >`
                : ""; // Si la URL está vacía, no añade nada
        }).get().join("");

        // Procesar las coordenadas
        const coordenadas = datos.find("coordenadas");
        const longitudCircuito = coordenadas.find("longitudCircuito").text();
        const latitudCircuito = coordenadas.find("latitudCircuito").text();
        const altitudCircuito = coordenadas.find("altitudCircuito").text();

        html += `
            <article>
                <h4>${nombre} - Circuito</h4>
                <p>Localidad: ${localidad}, ${pais}</p>
                <p>Longitud: ${longitud} km</p>
                <p>Ancho medio: ${anchuraMed} m</p>
                <p>Fecha: ${fecha}</p>
                <p>Hora: ${hora}</p>
                <p>Vueltas: ${nVueltas}</p>
                <p>Referencias: </p>
                <ul>${referencias}</ul>
                <p>Coordenadas del Circuito: (${latitudCircuito}, ${longitudCircuito}) a ${altitudCircuito} m</p>
                ${fotos}
        `;


        // Procesar los tramos
        $xml.find("tramos tramo").each((index, tramo) => {
            const dist = $(tramo).find("dist").text();
            const distUnidad = $(tramo).attr("distUnidad");
            const nSector = $(tramo).find("nSector").text();

            const coordenadasTramo = $(tramo).find("coordenadasTramo");
            const longitudTramo = coordenadasTramo.find("longitudTramo").text();
            const latitudTramo = coordenadasTramo.find("latitudTramo").text();
            const altitudTramo = coordenadasTramo.find("altitudTramo").text();

            html += `
            <section>
                <h5>Tramo ${index + 1}</h5>
                <p>Distancia: ${dist} ${distUnidad}</p>
                <p>Coordenadas del Tramo: (${latitudTramo}, ${longitudTramo}) a ${altitudTramo} m</p>
                <p>Número de sector: ${nSector}</p>
            </section>
        `;
        });

        html += `</article>`


        return html;
    }



    // Método para procesar los archivos KML y agregar las rutas al mapa
    procesarPlanimetria(files) {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const reader = new FileReader();

            reader.onload = (e) => {
                const contenidoKML = e.target.result;
                const coordenadas = this.parsearKML(contenidoKML);

                if (coordenadas.length > 0) {
                    this.agregarRutaAlMapa(coordenadas, i); // Agregar la ruta al mapa dinámico
                    // Ajustar el contenedor del mapa de planimetría
                    var seccionPlanimetria = $("main>section[data-element='zonaKML']");
                    var primerHijoSection = seccionPlanimetria.children("section:first");
                    primerHijoSection.attr("data-element", "mapaPlanimetria");
                } else {
                    console.error('El archivo KML no contiene coordenadas válidas.');
                }
            };

            reader.readAsText(file);
        }
    }

    // Método para parsear el contenido del archivo KML y extraer las coordenadas
    parsearKML(contenidoKML) {
        const coordenadas = [];
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(contenidoKML, 'text/xml');

        // Selector para obtener todas las coordenadas dentro de <coordinates> de tipo LineString
        const coordinatesNodes = xmlDoc.querySelectorAll('kml\\:coordinates, coordinates');

        coordinatesNodes.forEach((coordinatesNode) => {
            const coordinatesText = coordinatesNode.textContent.trim();
            const array = coordinatesText.split('\n').map((linea) => {
                const [lng, lat, alt] = linea.split(',').map(parseFloat);
                return [lng, lat, alt || 0]; // Asegurarse de que la altitud se defina aunque no esté presente
            });
            coordenadas.push(...array); // Agregar las coordenadas extraídas al array
        });
        return coordenadas;
    }

    agregarRutaAlMapa(coordenadas, rutaId) {
        var lng = 9.281183;
        var lat = 45.618978;
        mapboxgl.accessToken = 'pk.eyJ1IjoiYWxpY2lhZnAxNSIsImEiOiJjbGdzMnZweWowZWEyM2NvYWZkODMxZXpoIn0.ghWod73o3jm9F1lPOhfsjw';

        // Crear el mapa si aún no está creado
        if (!this.mapPlanimetria) {
            this.mapPlanimetria = new mapboxgl.Map({
                container: 'mapaDinamicoKML',
                style: 'mapbox://styles/mapbox/streets-v12',
                center: [lng, lat],
                zoom: 12,
            });
        }

        // Esperar a que se cargue el estilo antes de agregar la capa
        this.mapPlanimetria.on('style.load', () => {
            const sourceId = `route-source-${rutaId}`;
            const layerId = `route-layer-${rutaId}`;

            // Verificar si la fuente ya existe en el mapa
            let source = this.mapPlanimetria.getSource(sourceId);

            if (!source) {
                // Agregar la fuente solo si no existe
                this.mapPlanimetria.addSource(sourceId, {
                    'type': 'geojson',
                    'data': {
                        'type': 'Feature',
                        'properties': {},
                        'geometry': {
                            'type': 'LineString',
                            'coordinates': coordenadas
                        }
                    }
                });
            } else {
                // Actualizar las coordenadas de la fuente existente
                source.setData({
                    type: 'Feature',
                    properties: {},
                    geometry: {
                        type: 'LineString',
                        coordinates: coordenadas
                    }
                });
            }

            // Verificar si la capa ya existe en el mapa
            let layer = this.mapPlanimetria.getLayer(layerId);

            if (!layer) {
                // Agregar la capa solo si no existe
                this.mapPlanimetria.addLayer({
                    'id': layerId,
                    'type': 'line',
                    'source': sourceId,
                    'layout': {
                        'line-join': 'round',
                        'line-cap': 'round'
                    },
                    'paint': {
                        'line-color': '#FF0000',
                        'line-width': 8
                    }
                });
            }
        });
    }


    procesarAltimetria(files) {

        const file = files[0];
        const reader = new FileReader();
        reader.onload = (e) => {
            let xml = $.parseXML(reader.result);
            //version al svg para el validador
            let svg = $(xml).find("svg");
            svg.attr("version", "1.1");

            $("main>section[data-element='zonaSVG']").append(svg);
        };

        reader.readAsText(file);
    }






}