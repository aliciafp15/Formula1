class Memoria {

    init_time;// momento en el que se inicia el juego
    end_time; // momento en el que se termina el juego
    cont;//contador para verificar si terminamos de voltear

    constructor() {
        this.elements = [
            { element: "RedBull_a", source: "multimedia/imagenes/logos/RedBull.svg" },
            { element: "RedBull_b", source: "multimedia/imagenes/logos/RedBull.svg" },
            { element: "McLaren_a", source: "multimedia/imagenes/logos/McLaren.svg" },
            { element: "McLaren_b", source: "multimedia/imagenes/logos/McLaren.svg" },
            { element: "Alpine_a", source: "multimedia/imagenes/logos/Alpine.svg" },
            { element: "Alpine_b", source: "multimedia/imagenes/logos/Alpine.svg" },
            { element: "AstonMartin_a", source: "multimedia/imagenes/logos/AstonMartin.svg" },
            { element: "AstonMartin_b", source: "multimedia/imagenes/logos/AstonMartin.svg" },
            { element: "Ferrari_a", source: "multimedia/imagenes/logos/Ferrari.svg" },
            { element: "Ferrari_b", source: "multimedia/imagenes/logos/Ferrari.svg" },
            { element: "Mercedes_a", source: "multimedia/imagenes/logos/Mercedes.svg" },
            { element: "Mercedes_b", source: "multimedia/imagenes/logos/Mercedes.svg" },
        ];

        this.hasFlippedCard = false;//si ya hay una carta dada la vuelta
        this.lockBoard = false;//si el tablero se encuentra bloqueado a la interacción cdel usuario
        this.firstCard = null;// cuál es la primera carta a la que se ha dado la vuelta
        this.secondCard = null;//cuál es la segunda carta a la que se ha dado la vuelta

        this.shuffleElements()
        this.createElements();
        this.addEventListeners();

        //iniciliaza init_time
        this.init_time = new Date();
        this.cont = 0;

    }

    //baraja con el algoritmo Durstenfeld
    shuffleElements() {
        for (let i = this.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements[i], this.elements[j]] = [this.elements[j], this.elements[i]];
        }
    }
    unflipCards() {
        this.lockBoard = true; // Bloquea el tablero

        setTimeout(() => {
            //voltea  las cartas que están bocaarriba
            this.firstCard.dataset.state = 'init';
            this.secondCard.dataset.state = 'init';

            this.resetBoard();
        }, 1000);
    }

    //reinicia el tablero
    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }


    // comprueba si las cartas volteadas son iguales
    //Si lo son--> disableCards;    si no--> unflipCards. (utilizando operador ternario)
    checkForMatch() {
        this.firstCard.dataset.element.split('_')[0];//compara si es el mismo numero de cartaX
        const isMatch = this.firstCard.dataset.element.split('_')[0] === this.secondCard.dataset.element.split('_')[0];
        isMatch ? this.disableCards() : this.unflipCards();
    }

    //deshabilita las interacciones sobre las tarjetas de memoria que ya han sido emparejadas
    disableCards() {
        this.firstCard.dataset.state = 'revealed';
        this.secondCard.dataset.state = 'revealed';
        this.resetBoard();

        this.cont++;//aumento el contador


        //comprobar final del juego
        if (this.cont == (this.elements.length / 2)) { //si llegó a 6, siendo 12 cartas, es que están todas
            //iniciar endtime
            this.end_time = new Date();

            //conocer el tiempo que tardó
            var tiempoFinal = this.calculate_date_difference();

            //avisar al usuario
            // crear un nuevo <p> con el mensaje
            var mensaje = document.createElement('p');
            mensaje.textContent = "¡¡El juego ha terminado!! Duración: " + tiempoFinal;

            // seleccionar el <main> y el <section> hijo
            var main = document.querySelector('main');
            var section = document.querySelector('main > section');

            // insertar el <p> justo antes del <section>
            main.insertBefore(mensaje, section);
        }
    }

    /** cuenta con los valores de las variables init_time y end_time para obtener el tiempo total invertido en resolver 
     * horas:minutos:segundos.*/
    calculate_date_difference() {
        var tiempo = this.end_time - this.init_time;

        var horas = Math.floor(tiempo / ((1000 * 60) * 60));
        tiempo = tiempo - (horas * ((1000 * 60) * 60));

        var minutos = Math.floor(tiempo / (1000 * 60));
        tiempo = tiempo - (minutos * (1000 * 60));

        var segundos = Math.floor(tiempo / 1000);

        var resultado = (horas / 10 >= 1.0 ? horas : "0" + horas) + ":" +
            (minutos / 10 >= 1.0 ? minutos : "0" + minutos) + ":" +
            (segundos / 10 >= 1.0 ? segundos : "0" + segundos);

        return resultado;

    }

    createElements() {
        const secciones = document.querySelectorAll('section')
        const tablero = secciones[1];
        for (const carta in this.elements) {
            const elementData = this.elements[carta];

            // Crear un nodo article por cada elemento
            const card = document.createElement('article');
            card.setAttribute('data-element', elementData.element);// valor igual al valor de la variable element extraída del JSON.

            // Encabezado de orden 3
            const h3 = document.createElement('h3');
            h3.textContent = 'Tarjeta de memoria';
            card.appendChild(h3);

            // Imagen de la tarjeta
            const img = document.createElement('img');
            img.src = elementData.source;
            img.alt = elementData.element;
            card.appendChild(img);
            //solamente se visualizará cuando la tarjeta sea clicada por el usuario y se dé la vuelta.
            // Añadir la tarjeta al tablero de memoria
            tablero.appendChild(card);

        }
    }

    /* recorra todas las tarjetas creadas y provoque una llamada al método flipCard de la clase Memoria cuando se lance dicho evento.
    se debe invocar utilizando la característica bind de JavaScript de la siguiente manera: this.flipCard.bind(card, this)
    */
    addEventListeners() {
        const cards = document.querySelectorAll('article');
        cards.forEach(card => {
            card.addEventListener('click', this.flipCard.bind(card, this));
        });
    }

    /*Da la vuelta a las cartas cuando son pulsadas por le usuario*/
    flipCard(game) {
        if (this.dataset.state == 'revealed') return;
        if (game.lockBoard) return;
        if (game.firstCard != null) {//Si la tarjeta pulsada por el usuario coincide con la tarjeta pulsada anteriormente como primer elemento de la pareja actual 
            // var primeraCarta = game.firstCard.dataset.element
            // var parejaPrimera = primeraCarta.split('_')[1];
            // var segundaCarta = this.dataset.element;
            // var segundaPareja = segundaCarta.split('_')[1];
            if (game.firstCard.dataset.element === this.dataset.element) return; //el método retorna yno hace nada más.
        }
        this.dataset.state = 'flip';

        if (game.hasFlippedCard) {//vigilar el clicar dos veces la misma carta
            game.secondCard = this;
            game.checkForMatch();
        } else {
            game.hasFlippedCard = true;
            game.firstCard = this;//el valor de la tarjeta actual
        }

    }

}
