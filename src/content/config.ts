import { defineCollection, z } from 'astro:content';

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD');
const hora = z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM');

const base = {
  t: z.string(),
  hdad: z.string(),
  lugar: z.string(),
  tipo: z.string(),
  nota: z.string().optional(),
};

// Una agenda = un archivo JSON en src/content/agenda/ (el nombre del archivo es la URL: /agenda/<nombre>)
const agenda = defineCollection({
  type: 'data',
  schema: z.object({
    titulo: z.string().default('Agenda cofrade'),
    // Opcional: si no se pone, se genera sola a partir de los actos
    descripcion: z.string().max(200).optional(),
    desde: fecha,
    hasta: fecha,
    actos: z.array(z.object({ d: fecha, h: hora, ...base })).min(1),
    // Lo que está abierto todos los días (belenes, exposiciones...)
    permanentes: z.array(z.object(base)).default([]),
  }),
});

export const collections = { agenda };
