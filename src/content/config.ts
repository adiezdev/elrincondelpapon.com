import { defineCollection, z, type SchemaContext } from 'astro:content';

type ImageFn = SchemaContext['image'];

const fecha = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Formato AAAA-MM-DD');
const hora = z.string().regex(/^\d{2}:\d{2}$/, 'Formato HH:MM');

const base = (image: ImageFn) => ({
  t: z.string(),
  hdad: z.string(),
  lugar: z.string(),
  tipo: z.string(),
  nota: z.string().optional(),
  // Ruta relativa al JSON, p. ej. "../../assets/agenda/2026-11-20/cartel.jpg"
  cartel: image().optional(),
});

// Una agenda = un archivo JSON en src/content/agenda/ (el nombre del archivo es la URL: /agenda/<nombre>)
const agenda = defineCollection({
  type: 'data',
  schema: ({ image }) => z.object({
    titulo: z.string().default('Agenda cofrade'),
    // Opcional: si no se pone, se genera sola a partir de los actos
    descripcion: z.string().max(200).optional(),
    desde: fecha,
    hasta: fecha,
    actos: z.array(z.object({ d: fecha, h: hora, ...base(image) })).min(1),
    // Lo que está abierto todos los días (belenes, exposiciones...)
    permanentes: z.array(z.object(base(image))).default([]),
  }),
});

export const collections = { agenda };
