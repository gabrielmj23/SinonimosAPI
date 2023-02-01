# SinonimosAPI

Web Scraper para conseguir sinónimos y antónimos a partir de WordReference. Hecho en JavaScript con NodeJS, usando Express para las rutas y node-fetch + cheerio para el scraping.

## Instalación / Poner en marcha
1. Clonar el repositorio
```sh
git clone https://github.com/gabrielmj23/SinonimosAPI.git
```
2. Instalar dependencias
```sh
npm install
```
3. Ejecutar el servidor
```sh
npm run start
```

## Uso
El servidor estará escuchando en el puerto 3000. Hasta el momento tiene soporte para dos tipos de consultas:

### Sinónimos de una palabra
Devuelve una respuesta JSON con un arreglo ```sinonimos``` y un arreglo ```antonimos```.

Se consiguen estas consultas con un GET a ```http://localhost:3000/<palabra>```

### Verificar si dos palabras son sinónimos/antonimos
Devuelve una respuesta JSON con un campo booleano ```sonSinonimos``` o ```sonAntonimos```, dependiendo de la petición.

Se consiguen estas consultas con un GET a ```http://localhost:3000/comp/sinonimos?pal1=<palabra1>&pal2=<palabra2>``` y ```http://localhost:3000/comp/antonimos?pal1=<palabra1>&pal2=<palabra2>```. Es importante especificar ambos parámetros. El servidor hará las normalizaciones necesarias.