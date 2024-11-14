import xml.etree.ElementTree as ET

def generar_svg(archivo_xml, archivo_svg):
    try:
        arbol = ET.parse(archivo_xml)
    except IOError:
        print('No se encuentra el archivo', archivo_xml)
        return
    except ET.ParseError:
        print("Error procesando el archivo XML =", archivo_xml)
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

    # Verificación de puntos recolectados
    print(f'Cantidad de puntos recolectados: {len(distancias)}')  # Debería ser 19 antes de agregar p0 al final
    print('Coordenadas recolectadas:')
    for d, a in zip(distancias, altitudes):
        print(f'Distancia: {d}, Altitud: {a}')

    # Definir los rangos de dimensiones
    max_distancia = max(distancias)
    max_altitud = max(altitudes)
    min_altitud = min(altitudes)

    # Tamaño del SVG
    ancho_svg = 1000
    alto_svg = 500

    # Crear el archivo SVG
    with open(archivo_svg, 'w') as svg_file:
        svg_file.write('<?xml version="1.0" encoding="UTF-8" ?>\n')
        svg_file.write(f'<svg xmlns="http://www.w3.org/2000/svg" version="2.0" width="{ancho_svg}" height="{alto_svg}">\n')
        
        # Iniciar la polilínea
        svg_file.write('<polyline points="\n')

        # Escalar y agregar cada punto
        for i in range(len(distancias)):
            x = (distancias[i] / max_distancia) * ancho_svg #escalar la distancia a la anchura del SVG.
            y = alto_svg - ((altitudes[i] - min_altitud) / (max_altitud - min_altitud) * alto_svg) # Dado que la altitud está entre 180 y 201, este rango es relativamente estrecho.
                                                                                                    #debería traducir la altitud mínima (180) al borde inferior y la máxima (201) al borde superior,
            svg_file.write(f"{x},{y} ")

        # Agregar el primer punto al final para cerrar el circuito
        x0 = (distancias[0] / max_distancia) * ancho_svg
        y0 = alto_svg - ((altitudes[0] - min_altitud) / (max_altitud - min_altitud) * alto_svg)
        svg_file.write(f"{x0},{y0} ")  # Añadir el punto inicial al final para cerrar el circuito

        # Cerrar la etiqueta polyline y agregar el estilo
        svg_file.write('" style="fill:none;stroke:red;stroke-width:2" />\n')
        
        # Cerrar el SVG
        svg_file.write('</svg>')

    print(f'Se ha generado el archivo SVG en {archivo_svg}')

def main():
    archivo_xml = input('Introduce el archivo XML de entrada: ')
    archivo_svg = input('Introduce el nombre del archivo SVG de salida: ')
    generar_svg(archivo_xml, archivo_svg)

if __name__ == "__main__":
    main()
