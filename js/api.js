class API {


    constructor() {
        // Obtener el canvas del DOM
        this.canvas = document.querySelector("canvas");
        if (!this.canvas) {
            console.error("No se encontró el elemento canvas en el DOM.");
            return;
        }

        // Obtener el contexto 2D
        this.ctx = this.canvas.getContext("2d");
        if (!this.ctx) {
            console.error("No se pudo obtener el contexto 2D del canvas.");
        }

        // Referencias para arrastrar y soltar
        this.draggedPilot = null;
        //this.initDragAndDrop();

        // Mapeo de posiciones correctas
        this.correctPositions = {
            "Leclerc": "1°",
            "Piastri": "2°",
            "Norris": "3°"
        };

        // Estado para verificar si ya se ha tocado el sonido
        this.soundPlayed = {
            "Leclerc": false,
            "Piastri": false,
            "Norris": false
        };

        // Inicializar el contexto de audio
        //this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        // Asegurar que el contexto de audio se activa tras una interacción del usuario
        //document.body.addEventListener("click", this.resumeAudioContext.bind(this), { once: true });
        //document.body.addEventListener("touchstart", this.resumeAudioContext.bind(this), { once: true });


    }

    /*
    Habilita el contexto de audio, principalmente necesario para dispositivos táctiles.
    Crea la section de los pilots
    */
    iniciarJuego() {
        //habilita o reinicia el audio
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        this.resumeAudioContext();

        // Crear la sección de pilotos dinámicamente
        const pilotosSection = document.createElement("section");
        pilotosSection.innerHTML = `
        <h3>Pilotos</h3>
        <p draggable="true" id="Piastri">Piastri</p>
        <p draggable="true" id="Leclerc">Leclerc</p>
        <p draggable="true" id="Norris">Norris</p>
    `;

        // Agregar la sección al DOM en el main
        const main = document.querySelector("main");
        main.appendChild(pilotosSection);


        // Inicializar eventos de Drag and Drop para los nuevos elementos
        this.initDragAndDrop();
        // Limpiar el podio en el canvas
        //this.dibujarPodio();

        //deshabilitar boton
        const button = document.querySelector("button")
        button.disabled = true

    }

    resumeAudioContext() {

        if (!this.audioContext) {
            console.error("AudioContext no está inicializado.");
            return;
        }

        console.log("Intentando reanudar AudioContext...");
        if (this.audioContext.state === "suspended") {
            this.audioContext.resume().then(() => {
                console.log("AudioContext reanudado con éxito.");
            }).catch(error => {
                console.error("Error al reanudar AudioContext:", error);
            });
        } else {
            console.log("AudioContext no estaba suspendido. Estado actual:", this.audioContext.state);
        }
    }

    playSound(src) {
        const request = new XMLHttpRequest();
        request.open("GET", src, true);
        request.responseType = "arraybuffer";

        request.onload = () => {
            this.audioContext.decodeAudioData(request.response, buffer => {
                const source = this.audioContext.createBufferSource();
                source.buffer = buffer;
                source.connect(this.audioContext.destination);
                source.start();
            }, error => {
                console.error("Error al decodificar el sonido:", error);
            });
        };

        request.onerror = () => {
            console.error("Error al cargar el sonido.");
        };

        request.send();
    }





    dibujarPodio() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
        // Establecer el ancho y la altura de los rectángulos
        const podioWidth = this.canvas.width * 0.8;   // Ancho de cada rectángulo, 80% del ancho del canvas
        const podioHeight = this.canvas.height * 0.2;  // Altura de cada rectángulo, 20% de la altura del canvas
        const spaceBetween = this.canvas.height * 0.04; // Espacio entre los rectángulos, 4% de la altura del canvas
    
        // Posición inicial de los rectángulos (centrados)
        let startX = (this.canvas.width - podioWidth) / 2;  // Centrado horizontal
        let startY = (this.canvas.height - (podioHeight * 3 + spaceBetween * 2)) / 2; // Centrado vertical
    
        // Dibujar el primer lugar (Oro)
        this.ctx.fillStyle = "#FFD700"; // Oro
        this.ctx.fillRect(startX, startY, podioWidth, podioHeight); // Primer lugar
        this.ctx.strokeRect(startX, startY, podioWidth, podioHeight); // Contorno del rectángulo
    
        // Etiqueta 1º
        this.ctx.fillStyle = "#000";
        this.ctx.font = "24px Arial";
        this.ctx.fillText("1°", startX + podioWidth / 2 - 10, startY + podioHeight / 2 + 10); // Etiqueta 1º lugar
    
        // Dibujar el segundo lugar (Plata)
        startY += podioHeight + spaceBetween;  // Mover la posición hacia abajo
        this.ctx.fillStyle = "#C0C0C0"; // Plata
        this.ctx.fillRect(startX, startY, podioWidth, podioHeight); // Segundo lugar
        this.ctx.strokeRect(startX, startY, podioWidth, podioHeight); // Contorno del rectángulo
    
        // Etiqueta 2º
        this.ctx.fillStyle = "#000";
        this.ctx.font = "24px Arial";
        this.ctx.fillText("2°", startX + podioWidth / 2 - 10, startY + podioHeight / 2 + 10); // Etiqueta 2º lugar
    
        // Dibujar el tercer lugar (Bronce)
        startY += podioHeight + spaceBetween;  // Mover la posición hacia abajo
        this.ctx.fillStyle = "#cd7f32"; // Bronce
        this.ctx.fillRect(startX, startY, podioWidth, podioHeight); // Tercer lugar
        this.ctx.strokeRect(startX, startY, podioWidth, podioHeight); // Contorno del rectángulo
    
        // Etiqueta 3º
        this.ctx.fillStyle = "#000";
        this.ctx.font = "24px Arial";
        this.ctx.fillText("3°", startX + podioWidth / 2 - 10, startY + podioHeight / 2 + 10); // Etiqueta 3º lugar
    }
    
    
    
    







    initDragAndDrop() {
        // Agregar eventos Drag and Drop a los pilotos
        const pilotos = document.querySelectorAll("p[draggable='true']");
        pilotos.forEach(piloto => {
            piloto.addEventListener("dragstart", this.onDragStart.bind(this));
            piloto.addEventListener("dragend", this.onDragEnd.bind(this));

            // Eventos para dispositivos táctiles
            piloto.addEventListener("touchstart", this.onTouchStart.bind(this));
            piloto.addEventListener("touchmove", this.onTouchMove.bind(this));
            piloto.addEventListener("touchend", this.onTouchEnd.bind(this));
        });

        // Agregar eventos de Drop al canvas
        this.canvas.addEventListener("dragover", this.onDragOver.bind(this));
        this.canvas.addEventListener("drop", this.onDrop.bind(this));
    }

    onDragStart(event) {
        this.draggedPilot = event.target;
    }

    onDragEnd() {
        this.draggedPilot = null;
    }

    onDragOver(event) {
        event.preventDefault(); // Necesario para permitir soltar
    }

    /** PARA PANTALLAS TÁCTILES */

    /**Equivalente al mouseDown pero para dispositivos táctiles*/
    onTouchStart(event) {
        this.draggedPilot = event.target;

        // Asegúrate de que el piloto tenga `position: absolute`
        this.draggedPilot.style.position = "absolute";

        // Calcular offset inicial
        const touch = event.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        this.offsetX = touch.clientX - rect.left - this.draggedPilot.offsetLeft;
        this.offsetY = touch.clientY - rect.top - this.draggedPilot.offsetTop;

        // Ajustar posición inicial del piloto
        this.draggedPilot.style.left = `${touch.clientX - rect.left - this.offsetX}px`;
        this.draggedPilot.style.top = `${touch.clientY - rect.top - this.offsetY}px`;
    }

    onTouchMove(event) {
        if (this.draggedPilot) {
            const touch = event.touches[0];
            const rect = this.canvas.getBoundingClientRect();


            // Calcular nueva posición
            const x = touch.clientX - rect.left - this.offsetX;
            const y = touch.clientY - rect.top - this.offsetY;

            // Actualizar posición del piloto
            this.draggedPilot.style.left = `${x}px`;
            this.draggedPilot.style.top = `${y}px`;
        }
    }

    onTouchEnd(event) {

        if (this.draggedPilot) {
            // Llamar a onDrop con coordenadas táctiles
            const touch = event.changedTouches[0];
            const rect = this.canvas.getBoundingClientRect();

            // Crear un evento simulado para `onDrop`
            const simulatedEvent = {
                clientX: touch.clientX,
                clientY: touch.clientY,
            };

            this.onDrop(simulatedEvent);
            this.draggedPilot = null; // Limpiar referencia
        }
    }

    onDrop(event) {
        if (this.draggedPilot) {
            const rect = this.canvas.getBoundingClientRect(); // Obtener las coordenadas del canvas
        
            // Detectar si es táctil o ratón
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
    
            // Imprimir las coordenadas relativas
            console.log("Coordenadas del piloto:", x, y);
    
            // Obtener las dimensiones del canvas
            const canvasWidth = this.canvas.width;
            const canvasHeight = this.canvas.height;
        
            // Calcular las posiciones relativas en base a porcentajes
            let position = null;
        
            // Definir áreas del podio como porcentajes (relativos)
            const firstPlace = { x: 0.3, y: 0.15, width: 0.2, height: 0.2 }; // 1º lugar
            const secondPlace = { x: 0.3, y: 0.25, width: 0.2, height: 0.2 }; // 2º lugar
            const thirdPlace = { x: 0.3, y: 0.35, width: 0.2, height: 0.2 };  // 3º lugar
    
            // Mostrar los valores de las áreas del podio para depuración
            console.log("Áreas del podio:", { firstPlace, secondPlace, thirdPlace });
    
            // Verificar si la posición está dentro de las áreas relativas del podio
            if (x >= firstPlace.x * canvasWidth && x <= (firstPlace.x + firstPlace.width) * canvasWidth && y >= firstPlace.y * canvasHeight && y <= (firstPlace.y + firstPlace.height) * canvasHeight) {
                position = "1°";
                console.log("Posición 1° detectada");
            } else if (x >= secondPlace.x * canvasWidth && x <= (secondPlace.x + secondPlace.width) * canvasWidth && y >= secondPlace.y * canvasHeight && y <= (secondPlace.y + secondPlace.height) * canvasHeight) {
                position = "2°";
                console.log("Posición 2° detectada");
            } else if (x >= thirdPlace.x * canvasWidth && x <= (thirdPlace.x + thirdPlace.width) * canvasWidth && y >= thirdPlace.y * canvasHeight && y <= (thirdPlace.y + thirdPlace.height) * canvasHeight) {
                position = "3°";
                console.log("Posición 3° detectada");
            }
    
            if (position) {
                const pilotId = this.draggedPilot.id;
                const correctPosition = this.correctPositions[pilotId];
    
                // Verificar si el piloto está en la posición correcta
                console.log("Posición esperada para", pilotId, ":", correctPosition);
                console.log("Posición detectada:", position);
    
                if (correctPosition === position) {
                    if (!this.soundPlayed[pilotId]) {
                        this.playSound('multimedia/audios/correcto.mp3');
                        this.soundPlayed[pilotId] = true;
                    }
    
                    // Mover el piloto a la posición correcta en el podio
                    this.draggedPilot.style.position = "absolute";  // Asegurarse de que el piloto quede fijo
                    if (position === "1°") {
                        this.draggedPilot.style.left = `${firstPlace.x * canvasWidth}px`;
                        this.draggedPilot.style.top = `${firstPlace.y * canvasHeight}px`;
                    } else if (position === "2°") {
                        this.draggedPilot.style.left = `${secondPlace.x * canvasWidth}px`;
                        this.draggedPilot.style.top = `${secondPlace.y * canvasHeight}px`;
                    } else if (position === "3°") {
                        this.draggedPilot.style.left = `${thirdPlace.x * canvasWidth}px`;
                        this.draggedPilot.style.top = `${thirdPlace.y * canvasHeight}px`;
                    }
    
                    // Eliminar el piloto de la lista de pilotos disponibles
                    this.draggedPilot.parentElement.removeChild(this.draggedPilot);
                    this.ctx.fillStyle = "#000";
                    this.ctx.font = "20px Arial";
                    this.ctx.fillText(this.draggedPilot.textContent, x - 20, y);
                }
            } else {
                console.warn("El piloto no fue soltado en una posición válida.");
            }
        }
    }
    
    




}