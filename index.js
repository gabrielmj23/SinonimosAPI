import express from 'express';
import { obtenerSinonimos, normalizar } from './utils.js';

const app = express();
app.use(express.json());

const PORT = 3000;

/*
 * Endpoint que determina si 2 palabras son sinonimos
 */
app.get('/comp/', async (req, res) => {
  // Obtener parametros de la URL
  const { pal1, pal2 } = req.query;
  if (!(pal1 && pal2)) {
    res.status(400).json({
      ok: false,
      msg: 'Solicitud incorrecta. Especifica los parametros pal1 y pal2'
    });
    return;
  }

  // Obtener sinonimos de ambas palabras
  let sinonimosPalabra1 = await obtenerSinonimos(pal1);
  let sinonimosPalabra2 = await obtenerSinonimos(pal2);

  // Normalizar sinonimos para facilitar la comparacion
  sinonimosPalabra1 = sinonimosPalabra1.map((palabra) => normalizar(palabra));
  sinonimosPalabra2 = sinonimosPalabra2.map((palabra) => normalizar(palabra));

  // Verificar inclusion y mandar respuesta
  const sonSinonimos = (sinonimosPalabra1.includes(normalizar(pal2).toLowerCase()) || 
                        sinonimosPalabra2.includes(normalizar(pal1).toLowerCase()));
  res.json({
    ok: true,
    sonSinonimos
  });
});

/*
 * Endpoint que recibe la palabra a buscar y devuelve el listado de sinonimos
 */
app.get('/:palabra', async (req, res) => {
  const sinonimos = await obtenerSinonimos(req.params.palabra);
  
  // Si no se agregaron al arreglo, no se hallaron sinonimos
  if (sinonimos.length === 0) {
    res.json({
      ok: false,
      msg: `No se encontraron sinonimos para ${req.params.palabra}`
    });
  }
  // Enviar listado
  else {
    res.json({
      ok: true,
      sinonimos,
      msg: `Se encontraron ${sinonimos.length} sinonimos`
    });
  }
});

app.listen(PORT, () => {
  console.log(`Escuchando en port ${PORT}`);
});