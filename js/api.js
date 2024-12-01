class API {


    constructor() {
        // Obtener el canvas del DOM
        this.canvas = document.querySelector("canvas");
        console.log("constr")
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
    
        // Dibujar áreas válidas ampliadas (para depuración)
        this.ctx.strokeStyle = "red"; // Borde rojo para probar las áreas válidas
        this.ctx.strokeRect(330, 60, 160, 200); // Área ampliada 1º
        this.ctx.strokeRect(180, 130, 160, 160); // Área ampliada 2º
        this.ctx.strokeRect(480, 130, 160, 160); // Área ampliada 3º
    }
    
    





    initDragAndDrop() {
        // Agregar eventos Drag and Drop a los pilotos
        const pilotos = document.querySelectorAll("p[draggable='true']");
        pilotos.forEach(piloto => {
            piloto.addEventListener("dragstart", this.onDragStart.bind(this));
            piloto.addEventListener("dragend", this.onDragEnd.bind(this));
        });

        // Agregar eventos de Drop al canvas
        this.canvas.addEventListener("dragover", this.onDragOver.bind(this));
        this.canvas.addEventListener("drop", this.onDrop.bind(this));
    }

    onDragStart(event) {
        this.draggedPilot = event.target;
        console.log("Arrastrando: " + this.draggedPilot.textContent);
    }

    onDragEnd() {
        this.draggedPilot = null;
    }

    onDragOver(event) {
        event.preventDefault(); // Necesario para permitir soltar
    }

    onDrop(event) {
        event.preventDefault();
        if (this.draggedPilot) {
            const rect = this.canvas.getBoundingClientRect();
            const x = event.clientX - rect.left;
            const y = event.clientY - rect.top;
    
            let position = null;
    
            // Áreas válidas ajustadas para reflejar el podio más alto
            if (x >= 330 && x <= 490 && y >= 60 && y <= 260) { // Primer lugar (1º)
                position = "1°";
            } else if (x >= 180 && x <= 340 && y >= 130 && y <= 290) { // Segundo lugar (2º)
                position = "2°";
            } else if (x >= 480 && x <= 640 && y >= 130 && y <= 290) { // Tercer lugar (3º)
                position = "3°";
            }
    
            if (position) {
                console.log(`El piloto ${this.draggedPilot.textContent} fue colocado en la posición ${position}.`);
                this.ctx.fillStyle = "#000";
                this.ctx.font = "20px Arial";
                this.ctx.fillText(this.draggedPilot.textContent, x - 20, y);
            } else {
                console.warn("El piloto no fue soltado en una posición válida.");
            }
        }
    }
    
    
}