class API2 {
    constructor() {
        // Seleccionamos el único canvas en la página sin usar id
        this.canvas = document.querySelector('canvas');
        this.ctx = this.canvas.getContext('2d');

        // Inicializa el audio context
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false; // Controla si el sonido está en reproducción

        // Cargar el sonido del coche (puedes usar un archivo local o URL)
        this.loadSound();
    }


    loadSound() {
        // Carga el archivo de audio

        fetch('multimedia/audios/f1.mp3')
            .then(response => response.arrayBuffer())
            .then(data => this.audioContext.decodeAudioData(data))
            .then(buffer => {
                this.soundBuffer = buffer;
            })
            .catch(error => console.error('Error loading the sound:', error));
    }


    playSound() {
        if (this.isPlaying) return;

        // Reproduce el sonido
        const soundSource = this.audioContext.createBufferSource();
        soundSource.buffer = this.soundBuffer;
        soundSource.connect(this.audioContext.destination);
        soundSource.loop = false; // El sonido NO se repite en bucle
        soundSource.start();

        this.isPlaying = true;
    }

    dibujarCoche() {
        // Asegúrate de que el canvas tiene las dimensiones correctas
        this.updateCanvasSize();  // Este método debe asegurarse de que el canvas ocupe todo el tamaño disponible.

        const ctx = this.ctx;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height); // Limpiar el canvas

        // Obtén las dimensiones del canvas
        const canvasWidth = this.canvas.width;
        const canvasHeight = this.canvas.height;

        // Relación de escala, la idea es que el coche ocupe todo el canvas
        const scaleX = canvasWidth / 350; // Escala en X según el tamaño del canvas
        const scaleY = canvasHeight / 180; // Escala en Y según el tamaño del canvas

        // Dibuja el cuerpo del coche (un rectángulo grande con curvas)
        ctx.beginPath();
        ctx.moveTo(50 * scaleX, 150 * scaleY); // Parte inferior izquierda
        ctx.lineTo(300 * scaleX, 150 * scaleY); // Parte inferior derecha
        ctx.lineTo(300 * scaleX, 100 * scaleY); // Línea hacia arriba en la derecha
        ctx.quadraticCurveTo(275 * scaleX, 70 * scaleY, 220 * scaleX, 70 * scaleY); // Curva superior
        ctx.quadraticCurveTo(160 * scaleX, 70 * scaleY, 150 * scaleX, 100 * scaleY); // Curva descendente
        ctx.lineTo(50 * scaleX, 100 * scaleY); // Línea hacia abajo en la izquierda
        ctx.closePath();
        ctx.fillStyle = '#990000'; // Color rojo para el coche
        ctx.fill();
        ctx.strokeStyle = 'black';
        ctx.stroke();

        // Dibuja las ruedas (dos círculos)
        ctx.beginPath();
        ctx.arc(100 * scaleX, 150 * scaleY, 20 * scaleX, 0, Math.PI * 2); // Rueda izquierda
        ctx.arc(250 * scaleX, 150 * scaleY, 20 * scaleX, 0, Math.PI * 2); // Rueda derecha
        ctx.fillStyle = 'black'; // Color de las ruedas
        ctx.fill();
        ctx.stroke();

        // Añadir interacción con el coche: si haces clic en el coche, reproduce el sonido
        this.canvas.addEventListener('click', () => this.playSound());
    }

    updateCanvasSize() {
        // Actualiza el tamaño del canvas a las dimensiones del contenedor
        this.canvas.width = this.canvas.parentElement.offsetWidth;
        this.canvas.height = this.canvas.parentElement.offsetHeight;
        this.ctx = canvas.getContext('2d');
    }





    updateCanvasSize() {
        // Sincroniza el tamaño del canvas con el tamaño visible en CSS
        this.canvas.width = this.canvas.offsetWidth;
        this.canvas.height = this.canvas.offsetHeight;
    }



    leerCoche(files) {
        // Solo tomamos el primer archivo
        const file = files[0];



        // Crea un FileReader para leer la imagen
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {

                // Verifica el nombre del archivo y agrega más HTML
                if (file.name.toLowerCase().includes('ferrari')) {
                    this.addFerrariHtml(img);  // Pasa la imagen al método
                } else if (file.name.toLowerCase().includes('maserati')) {
                    this.addMaseratiHtml(img); // Pasa la imagen al método
                } else {
                    // Si no es ni Ferrari ni Maserati, puedes mostrar algo genérico
                    this.addGenericHtml(img);
                }
            };
            img.src = e.target.result;  // Establecer la fuente de la imagen como el contenido leído
        };

        reader.readAsDataURL(file);  // Leer el archivo como una URL de datos
    }



    // Añadir Ferrari a un nuevo article
    addFerrariHtml(img) {
        const articulo = $('<article></article>');

        const header = $('<h4></h4>').text('Ferrari 312B (1970)');
        articulo.append(header);

        const p1 = $('<p></p>').text('Debutó en 1970, año en que Jacky Ickx luchó contra Jochen Rindt y los Lotus 49/72...');
        articulo.append(p1);

        const p2 = $('<p></p>').text('En 1971, Mario Andretti se llevó el GP de Sudáfrica, en su debut en la F1...');
        articulo.append(p2);

        // Crear la imagen y añadirla al final del article
        const image = $('<img>')
            .attr('src', img.src)
            .attr('alt', 'Imagen de Ferrari 312B (1970)');  // Añadir el atributo alt con una descripción
        articulo.append(image);

        $('main').find('section').eq(1).append(articulo);
    }


    addMaseratiHtml(img) {
        // Crear la sección dentro del <main>
        const articulo = $('<article></article>');

        // Crear y añadir el encabezado
        const header = $('<h4></h4>').text('Maserati 250F (1954)');
        articulo.append(header);

        // Crear y añadir el primer párrafo
        const p1 = $('<p></p>').text('Compitió en 46 carreras que contabilizaron un total de 277 inscripciones entre pilotos oficiales y privados. Juan Manuel Fangio logró las dos primeras victorias del modelo, antes de partir a Mercedes. 1955 fue un año en blanco por el dominio aléman, mientras que 1956 Stirling Moss ganó en Mónaco y Monza. 1957 fue un año en que Maserati y Vanwall se llevaron las victorias, y donde Fangio, a pesar de ganar en Argentina, Mónaco y Francia, tuvo que sudar tinta en Alemania para superar a los Ferrari, en una de las mejores carreras de la historia.');
        articulo.append(p1);

        // Crear y añadir el segundo párrafo
        const p2 = $('<p></p>').text('El aura de esa victoria en Nürburgring convierte al 250F, de líneas fluidas y equilibradas, en el icono de la década');
        articulo.append(p2);


        // Crear la imagen y añadirla al final del article
        const image = $('<img>')
            .attr('src', img.src)  // Establece la fuente de la imagen
            .attr('alt', 'Maserati 250F en la temporada de F1 de 1954');  // Añadir el atributo alt con una descripción

        articulo.append(image);

        $('main').find('section').eq(1).append(articulo);

    }


    addGenericHtml(img) {
        const articulo = $('<article></article>');

        const header = $('<h4></h4>').text('Tu coche');
        articulo.append(header);

        // Crear y añadir el  párrafo
        const p1 = $('<p></p>').text('¡No reconozco el coche pero seguro es interesante!');
        articulo.append(p1);
        // Crear la imagen y añadirla al final del article
        const image = $('<img>')
            .attr('src', img.src)
            .attr('alt', 'Imagen de tu coche personal');  // Añadir el atributo alt con una descripción
        articulo.append(image);


        $('main').find('section').eq(1).append(articulo);
    }
}
