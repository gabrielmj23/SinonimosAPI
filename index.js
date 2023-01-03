import { load } from 'cheerio';
import express from 'express';
import fetch from 'node-fetch';

const app = express();
app.use(express.json());

const PORT = 3000;

/*
 * Endpoint que recibe la palabra a buscar y devuelve el listado de sinonimos
 */
app.get('/:palabra', async (req, res) => {
  // Obtener html de la pagina
  const response = await fetch(`https://www.wordreference.com/sinonimos/${req.params.palabra}`);
  const body = await response.text();
  const $ = load(body);

  // Guardar sinonimos en arreglo
  const sinonimos = [];
  $('div.clickable').find('li').each((i, el) => {
    const elemHtml = $(el).html();
    if (!elemHtml.startsWith('<span')) {
      elemHtml.split(', ').forEach(
        (sinonimo) => sinonimos.push(sinonimo.trim())
      );
    }
  });
  
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