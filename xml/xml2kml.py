import xml.etree.ElementTree as ET

def convertir_xml_a_kml(archivo_xml):
    try:
        arbol = ET.parse(archivo_xml)
    except IOError:
        print('No se encuentra el archivo', archivo_xml)
        return
    except ET.ParseError:
        print("Error procesando el archivo XML =", archivo_xml)
        return

    raiz = arbol.getroot()

    # Extraer nombre del circuito o usa un nombre genérico
    nombre_circuito = raiz.find('.//{http://www.uniovi.es}nombre').text if raiz.find('.//{http://www.uniovi.es}nombre') else 'circuito'
    kml_file_name = f"{nombre_circuito}.kml"
    
    # Crear y escribir el archivo KML
    with open(kml_file_name, 'w') as kml_file:
        kml_file.write('<?xml version="1.0" encoding="UTF-8"?>\n')
        kml_file.write('<kml xmlns="http://www.opengis.net/kml/2.2">\n')
        kml_file.write('<Document>\n')
        kml_file.write(f'<name>{nombre_circuito}</name>\n')

        # Extraer y escribir coordenadas generales del circuito
        kml_file.write('<Placemark>\n')
        kml_file.write('<LineString>\n')
        kml_file.write('<extrude>1</extrude>\n')
        kml_file.write('<tessellate>1</tessellate>\n')
        kml_file.write('<coordinates>\n')
        
        # Coordenadas generales del circuito
        coords_circuito = raiz.find('.//{http://www.uniovi.es}coordenadas')
        if coords_circuito is not None:
            latitud_circuito = coords_circuito.find('{http://www.uniovi.es}latitudCircuito').text
            longitud_circuito = coords_circuito.find('{http://www.uniovi.es}longitudCircuito').text
            altitud_circuito = coords_circuito.find('{http://www.uniovi.es}altitudCircuito').text
            kml_file.write(f'{longitud_circuito},{latitud_circuito},{altitud_circuito}\n')

        # Extraer y escribir coordenadas de cada tramo del circuito
        for tramo in raiz.findall('.//{http://www.uniovi.es}tramo'):
            latitud_tramo = tramo.find('.//{http://www.uniovi.es}latitudTramo').text
            longitud_tramo = tramo.find('.//{http://www.uniovi.es}longitudTramo').text
            altitud_tramo = tramo.find('.//{http://www.uniovi.es}altitudTramo').text
            kml_file.write(f'{longitud_tramo},{latitud_tramo},{altitud_tramo}\n')

        # Cierre de coordenadas y LineString
        kml_file.write('</coordinates>\n')
        kml_file.write('</LineString>\n')
        kml_file.write('<Style id="lineaRoja">\n')
        kml_file.write('<LineStyle>\n')
        kml_file.write('<color>#ff0000ff</color>\n')
        kml_file.write('<width>5</width>\n')
        kml_file.write('</LineStyle>\n')
        kml_file.write('</Style>\n')
        kml_file.write('</Placemark>\n')

        # Cierre del documento KML
        kml_file.write('</Document>\n')
        kml_file.write('</kml>')

    print(f'Se ha convertido el circuito a KML en {kml_file_name}')

def main():
    archivo_xml = input('Introduce el archivo XML de entrada: ')
    convertir_xml_a_kml(archivo_xml)

if __name__ == "__main__":
    main()
