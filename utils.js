import fetch from 'node-fetch';
import { load } from 'cheerio';

/**
 * Funcion auxiliar para normalizar texto. Elimina acentos y dieresis. https://es.stackoverflow.com/questions/62031/eliminar-signos-diacr%C3%ADticos-en-javascript-eliminar-tildes-acentos-ortogr%C3%A1ficos
 * @param {string} palabra Palabra a normalizar
 * @returns {string} Palabra sin acentos ni dieresis
 */
export const normalizar = (palabra) => {
  return palabra.normalize('NFD')
                .replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi,"$1$2")
                .normalize();
}

/**
 * Funcion para obtener los sinonimos y antonimos de una palabra
 * @param {string} palabra Palabra sobre la cual se buscan los sinonimos y antonimos
 */
export const obtenerListados = async (palabra) => {
  const response = await fetch(`https://www.wordreference.com/sinonimos/${palabra}`);
  const body = await response.text();
  const $ = load(body);

  // Guardar resultados en arreglos
  const sinonimos = [], antonimos = [];
  $('div.clickable').find('li').each((_, el) => {
    const elemHtml = $(el).html();

    // Los antonimos se encuentran en etiquetas <span>
    if (elemHtml.startsWith('<span')) {
      elemHtml.substring(27).replace('</span>', '').split(', ').forEach(
        (antonimo) => antonimos.push(antonimo.trim())
      );
    }
    else {
      elemHtml.split(', ').forEach(
        (sinonimo) => sinonimos.push(sinonimo.trim())
      );
    }
  });

  return {
    sinonimos, antonimos
  };
}