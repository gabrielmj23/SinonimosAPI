import express from 'express';
import { normalizar, obtenerListados } from './utils.js';

const app = express();
app.use(express.json());

const PORT = 3000;

/*
 * Endpoint que determina si 2 palabras son sinonimos
 */
app.get('/comp/sinonimos', async (req, res) => {
  // Obtener parametros de la URL
  const { pal1, pal2 } = req.query;
  if (!(pal1 && pal2)) {
    res.status(400).json({
      msg: 'Solicitud incorrecta. Especifica los parametros pal1 y pal2'
    });
    return;
  }

  // Obtener sinonimos de ambas palabras
  let sinonimosPalabra1 = (await obtenerListados(pal1)).sinonimos;
  let sinonimosPalabra2 = (await obtenerListados(pal2)).sinonimos;

  // Normalizar sinonimos para facilitar la comparacion
  sinonimosPalabra1 = sinonimosPalabra1.map((palabra) => normalizar(palabra));
  sinonimosPalabra2 = sinonimosPalabra2.map((palabra) => normalizar(palabra));

  // Verificar inclusion y mandar respuesta
  const sonSinonimos = sinonimosPalabra1.includes(normalizar(pal2).toLowerCase()) || 
                       sinonimosPalabra2.includes(normalizar(pal1).toLowerCase());
  res.json({
    sonSinonimos
  });
});

/*
 * Endpoint que determina si 2 palabras son antonimos
 */
app.get('/comp/antonimos', async (req, res) => {
  // Obtener parametros de la URL
  const { pal1, pal2 } = req.query;
  if (!(pal1 && pal2)) {
    res.status(400).json({
      msg: 'Solicitud incorrecta. Especifica los parametros pal1 y pal2'
    });
    return;
  }

  // Obtener sinonimos de ambas palabras
  let antonimosPalabra1 = (await obtenerListados(pal1)).antonimos;
  let antonimosPalabra2 = (await obtenerListados(pal2)).antonimos;

  // Normalizar sinonimos para facilitar la comparacion
  antonimosPalabra1 = antonimosPalabra1.map((palabra) => normalizar(palabra));
  antonimosPalabra2 = antonimosPalabra2.map((palabra) => normalizar(palabra));

  // Verificar inclusion y mandar respuesta
  const sonAntonimos = antonimosPalabra1.includes(normalizar(pal2).toLowerCase()) || 
                       antonimosPalabra2.includes(normalizar(pal1).toLowerCase());
  res.json({
    sonAntonimos
  });
});

/*
 * Endpoint que recibe la palabra a buscar y devuelve el listado de sinonimos y de antonimos
 */
app.get('/:palabra', async (req, res) => {
  const resultados = await obtenerListados(req.params.palabra);
  res.json({ ...resultados });
});

app.listen(PORT, () => {
  console.log(`Escuchando en port ${PORT}`);
});