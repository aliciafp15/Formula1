class Pais {

	constructor(nombre, capital, poblacion) {
		this.nombre = nombre;
		this.capital = capital;
		this.poblacion = poblacion;
	}

    setGobierno(gobierno){
		this.gobierno = gobierno;
	}
	
	setReligion(religion){ //mayoritaria
		this.religion = religion;
	}
	
	setCoordenadas(latitud,longitud ) { //de la linea de meta
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
        return `Coordenadas de la línea de meta del circuito: ${this.latitud}, ${this.longitud}`;
    }

}