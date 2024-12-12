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
        this.initDragAndDrop();

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
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();


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

        // Dibujar el podio con mayor altura
        // Dimensiones ajustadas para ocupar más espacio hacia abajo
        this.ctx.fillStyle = "#FFD700"; // Oro
        this.ctx.fillRect(350, 80, 120, 180); // Primer lugar (más alto)
        this.ctx.strokeRect(350, 80, 120, 180);

        this.ctx.fillStyle = "#C0C0C0"; // Plata
        this.ctx.fillRect(200, 140, 120, 140); // Segundo lugar (ajustado más abajo)
        this.ctx.strokeRect(200, 140, 120, 140);

        this.ctx.fillStyle = "#cd7f32"; // Bronce
        this.ctx.fillRect(500, 140, 120, 140); // Tercer lugar (ajustado más abajo)
        this.ctx.strokeRect(500, 140, 120, 140);

        // Dibujar etiquetas para el podio
        this.ctx.fillStyle = "#000";
        this.ctx.font = "24px Arial";
        this.ctx.fillText("1°", 400, 150); // Etiqueta 1º lugar
        this.ctx.fillText("2°", 250, 220); // Etiqueta 2º lugar
        this.ctx.fillText("3°", 550, 220); // Etiqueta 3º lugar

        /*
        // Dibujar áreas válidas ampliadas (para depuración)
        this.ctx.strokeStyle = "red"; // Borde rojo para probar las áreas válidas
        this.ctx.strokeRect(330, 60, 160, 200); // Área ampliada 1º
        this.ctx.strokeRect(180, 130, 160, 160); // Área ampliada 2º
        this.ctx.strokeRect(480, 130, 160, 160); // Área ampliada 3º
        */

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
            const rect = this.canvas.getBoundingClientRect();

            // Detectar si es táctil o ratón
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;

            let position = null;

            // Verificar en qué área del podio se soltó el piloto
            if (x >= 330 && x <= 490 && y >= 60 && y <= 260) { // Primer lugar (1º)
                position = "1°";
            } else if (x >= 180 && x <= 340 && y >= 130 && y <= 290) { // Segundo lugar (2º)
                position = "2°";
            } else if (x >= 480 && x <= 640 && y >= 130 && y <= 290) { // Tercer lugar (3º)
                position = "3°";
            }

            if (position) {
                const pilotId = this.draggedPilot.id;
                const correctPosition = this.correctPositions[pilotId];

                if (correctPosition === position) {
                    if (!this.soundPlayed[pilotId]) {
                        this.playSound('multimedia/audios/correcto.mp3');
                        this.soundPlayed[pilotId] = true;
                    }
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