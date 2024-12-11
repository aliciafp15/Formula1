class Noticias {

    /** Comprueba si el navegador en uso está soportando el uso de la API file */
    constructor() {
        // Version 1.1 23/10/2021 
        if (window.File && window.FileReader && window.FileList && window.Blob) {
            //El navegador soporta el API File
        }
        else document.write("<p>Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");

    }

    /** Lectura del fichero noticias.txt, linea a linea, y escribe en html */
    readInputFile(files) {
        //Solamente toma un archivo
        //var archivo = document.getElementById("archivoTexto").files[0];
        var archivo = files[0];
        console.log(archivo)
        //Solamente admite archivos de tipo texto
        var tipoTexto = /text.*/;


        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = (evento) => {
                this.escribirNoticias(lector.result);
            }
            lector.readAsText(archivo);
        }
        else {
            alert("Solo valen .txt")
        }
    }


    escribirNoticias(texto) {
        var noticias = texto.split("\n"); //divide las noticias

        var i = 0;
        for (i; i < noticias.length; i++) {//recorre una  una

            var noticia = noticias[i];
            var info = noticia.split("_");
            var titulo = info[0];
            var entradilla = info[1];
            var autor = info[2];

            // cada noticia es un Article
            var article = $("<article></article>");
            article.append("<h3>" + titulo + "</h3>");
            article.append("<h4>" + entradilla + "</h4>");
            article.append("<p>" + autor + "</p>");

            // Comprobar si ya existen artículos en la sección
            var lastArticle = $("main > section:first > article:last");
            if (lastArticle.length > 0) {
                // Si ya existe un artículo, insertar después del último
                lastArticle.after(article);
            } else {
                // Si no hay artículos, agregarlo como el primer hijo de la sección
                $("main > section:first").append(article);
            }
        }


    }
    redactarNoticiasPropias() {
        // Sección para la nueva noticia
        $("main").append("<section></section>");

        // Añadir elementos a la sección
        $("main>section:last")
            .append("<h3>Nueva noticia</h3>")
            .append("<label><input type='text'  placeholder='Inserte el titulo' required>Titulo:</label> ")
            .append("<label><input type='text'  placeholder='Inserte la entradilla' required>Entradilla:</label> ")
            .append("<label></label> <input type='text' placeholder='Inserte el autor' required>Autor:")
            .append("<button type='button'>Añadir</button>")
            .find("button") // Busca el último botón dentro de la sección
            .on("click", () => this.incluirNuevaNoticiaHTML());
    }



    incluirNuevaNoticiaHTML() {
        // Obtener valores de los inputs
        var titular = $("main > section:last form input:first").val();
        var entradilla = $("main > section:last form input:eq(2)").val();
        var autor = $("main > section:last form  input:last").val();

        // Validar campos
        if (!titular || !entradilla || !autor) {
            alert("Todos los campos son obligatorios. Por favor, complete la información.");
            return;
        }

        // Crear y agregar la nueva noticia al HTML
        var noticiaArticle = $("<article></article>")
            .append("<h3>" + titular + "</h3>")
            .append("<h4>" + entradilla + "</h4>")
            .append("<p>" + autor + "</p>");

        $(noticiaArticle).appendTo($("section").first());

    }



}