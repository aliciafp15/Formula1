class Semaforo {
    constructor() {
        // Atributos
        this.levels = [0.2, 0.5, 0.8]; // Dificultad del juego
        this.lights = 4; // Número de luces del semáforo
        this.unload_moment = null; // Momento en que inicia la secuencia de apagado
        this.clic_moment = null; // Momento en que el usuario pulsa el botón

        // Inicializar la dificultad del juego de forma aleatoria
        const randomIndex = Math.floor(Math.random() * 3); // Índice aleatorio entre 0 y 2
        this.difficulty = this.levels[randomIndex]; // Asignar dificultad

        // Crear la estructura del juego en el HTML
        this.createStructure();
    }

    // Método para crear la estructura HTML del semáforo y otros elementos del juego
    createStructure() {
        // Seleccionar el elemento <main> del documento
        const main = document.querySelector("main");
        var seccion = document.createElement("section"); // creamos el elemento sección que contendrá todo el juego del semáforo



        // Crear y añadir el título del juego
        const title = document.createElement("h3");
        title.textContent = "Juego del Semáforo";
        seccion.appendChild(title);


        // Crear las luces del semáforo (solo se permite usar div para esto)
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement("div");
            seccion.appendChild(light);
        }

        // Crear botón para arrancar el semáforo
        const startButton = document.createElement("button");
        startButton.textContent = "Arrancar Semáforo";
        startButton.setAttribute("type", "button");
        startButton.onclick = this.initSequence.bind(this);
        seccion.appendChild(startButton);

        // Crear botón para registrar tiempo de reacción
        const reactionButton = document.createElement("button");
        reactionButton.textContent = "Pulsa para medir reacción";
        reactionButton.setAttribute("type", "button");
        reactionButton.onclick = this.stopReaction.bind(this);
        reactionButton.setAttribute("disabled", "true");
        seccion.appendChild(reactionButton);

        main.appendChild(seccion);
    }



    // Método para iniciar la secuencia de encendido del semáforo
    initSequence() {
        const seccion = document.querySelector("body > main > section");
        const aux = document.querySelector("body > main > section > p:last-child");

        if (aux) {
            seccion.removeChild(aux);
        }

        // Añadir la clase "load" a <main> para iniciar la animación
        document.querySelector("body > main").classList.add("load");

        // Deshabilitar el botón "Arrancar"
        document
            .querySelector("body > main > section > button:first-of-type")
            .setAttribute("disabled", "true");

        setTimeout(() => {
            this.unload_moment = new Date().getTime(); //obtener la fecha y hora actual
            this.endSequence();
        }, this.difficulty * 1000 + 1500);
    }

    /* Habilita el segundo botón del juego, para que el usuario pueda pulsarlo y registrar su tiempo de reacción.
    Dentro de este método también se debe añadir la clase unload a la etiqueta main del documento para que se ejecute el apagado de las luces del semáforo. */
    endSequence() {

        document.querySelector("body>main").classList.remove("load");
        document.querySelector("body>main>section>button:nth-of-type(2)").removeAttribute("disabled");
        document.querySelector("body>main").classList.add("unload"); // añadimos a la etiqueta main la clase unload

    }




    stopReaction()
    {
       
            // obtener la fecha actual y guardarla en la variable clic_moment.
            this.clic_moment = new Date().getTime();
            //calcular la diferencia entre los valores de las variables unload_moment y clic_moment en milisegundos
            var diferencia = ((this.clic_moment - this.unload_moment)/1000).toFixed(3);

            // crear un párrafo donde informar el usuario de su tiempo de reacción y mostrarlo por pantalla.
            var parrafo = document.createElement("p");
            var rellenoParrafo = document.createTextNode("Tiempo de reacción: " + diferencia + " milisegundos");
            parrafo.appendChild(rellenoParrafo);
            var seccion = document.querySelector("body>main>section");
            seccion.appendChild(parrafo);

            //quitar las clases load y unload de la etiqueta main;
            var main = document.querySelector("body>main");
            main.classList.remove("load");
            main.classList.remove("unload");

            //deshabilitar el botón “Reacción” y habilitar el botón “Arranque”.
            document.querySelector("body>main>section>button:first-of-type").removeAttribute("disabled"); 
            document.querySelector("body>main>section>button:nth-of-type(2)").setAttribute("disabled","true");
    }
}
