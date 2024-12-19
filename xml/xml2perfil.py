import xml.etree.ElementTree as ET

class Enter:
    def __init__(self, archivo_xml, archivo_svg):
        self.archivo_xml = archivo_xml
        self.archivo_svg = archivo_svg

    def generar_svg(self):
        try:
            arbol = ET.parse(self.archivo_xml)
        except IOError:
            print('No se encuentra el archivo', self.archivo_xml)
            return
        except ET.ParseError:
            print("Error procesando el archivo XML =", self.archivo_xml)
            return

        raiz = arbol.getroot()

        # Obtener las distancias y altitudes
        distancias = []
        altitudes = []
        distancia_acumulada = 0

        for tramo in raiz.findall('.//{http://www.uniovi.es}tramo'):
            distancia_element = tramo.find('.//{http://www.uniovi.es}dist')
            altitud_element = tramo.find('.//{http://www.uniovi.es}coordenadasTramo/{http://www.uniovi.es}altitudTramo')

            if distancia_element is not None and altitud_element is not None:
                distancia_acumulada += float(distancia_element.text)
                distancias.append(distancia_acumulada)
                altitudes.append(float(altitud_element.text))

        # Definir los rangos de dimensiones
        max_distancia = max(distancias)
        min_distancia = min(distancias)
        max_altitud = max(altitudes)
        min_altitud = min(altitudes)

        # Tamaño del SVG reducido para móviles
        ancho_svg = 500  # Más pequeño para pantallas móviles
        alto_svg = 250

        # Factor de escala más reducido
        factor_escala = 0.4

        # Crear el archivo SVG
        with open(self.archivo_svg, 'w') as svg_file:
            svg_file.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
            svg_file.write(f'<svg xmlns="http://www.w3.org/2000/svg" version="2.0" width="{ancho_svg}" height="{alto_svg}">\n')
            
            svg_file.write('<polyline points="\n')

            # Escalar y agregar cada punto
            for i in range(len(distancias)):
                # Normalizar las distancias para que empiecen desde el lado izquierdo
                x = ((distancias[i] - min_distancia) / (max_distancia - min_distancia)) * ancho_svg * factor_escala
                y = alto_svg - ((altitudes[i] - min_altitud) / (max_altitud - min_altitud) * alto_svg * factor_escala)
                
                svg_file.write(f"{x},{y} ")

            # Agregar el primer punto al final para cerrar el circuito
            x0 = ((distancias[0] - min_distancia) / (max_distancia - min_distancia)) * ancho_svg * factor_escala
            y0 = alto_svg - ((altitudes[0] - min_altitud) / (max_altitud - min_altitud) * alto_svg * factor_escala)
            svg_file.write(f"{x0},{y0} ")  # Añadir el punto inicial al final para cerrar el circuito

            # Cerrar la etiqueta polyline y agregar el estilo
            svg_file.write('" style="fill:none;stroke:red;stroke-width:2" />\n')
            
            # Cerrar el SVG
            svg_file.write('</svg>')

        print(f'Se ha generado el archivo SVG en {self.archivo_svg}')

# Programa principal
if __name__ == "__main__":
    archivo_xml = input('Introduce el archivo XML de entrada: ')
    archivo_svg = input('Introduce el nombre del archivo SVG de salida: ')
    enter = Enter(archivo_xml, archivo_svg)
    enter.generar_svg()
