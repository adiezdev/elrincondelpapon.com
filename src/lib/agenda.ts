import { getCollection, type CollectionEntry } from 'astro:content';

export type Agenda = CollectionEntry<'agenda'>;

const TZ = 'Europe/Madrid';
const at = (d: string) => new Date(d + 'T12:00:00Z');
const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Todas las agendas, de la más reciente a la más antigua */
export async function getAgendas(): Promise<Agenda[]> {
  const all = await getCollection('agenda');
  return all.sort((a, b) => b.data.desde.localeCompare(a.data.desde));
}

/** "Viernes 20" */
export const nombreDia = (d: string) =>
  cap(at(d).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', timeZone: TZ }));

/** "Del viernes 20 al domingo 22 de noviembre de 2026" */
export function rangoLargo(desde: string, hasta: string) {
  const p = (d: string, o: Intl.DateTimeFormatOptions) => at(d).toLocaleDateString('es-ES', { ...o, timeZone: TZ });
  const dia = (d: string) => `${p(d, { weekday: 'long' })} ${+d.slice(8)}`;
  const mes = (d: string) => p(d, { month: 'long' });
  const fin = `${dia(hasta)} de ${mes(hasta)} de ${hasta.slice(0, 4)}`;
  if (desde === hasta) return cap(fin);
  const ini = desde.slice(0, 7) === hasta.slice(0, 7) ? dia(desde) : `${dia(desde)} de ${mes(desde)}`;
  return `Del ${ini} al ${fin}`;
}

/** "20–22 nov 2026" */
export function rangoCorto(desde: string, hasta: string) {
  const [y1, m1, d1] = desde.split('-');
  const [y2, m2, d2] = hasta.split('-');
  const mes = (d: string) => at(d).toLocaleDateString('es-ES', { month: 'short', timeZone: TZ }).replace('.', '');
  if (desde === hasta) return `${+d1} ${mes(desde)} ${y1}`;
  if (m1 === m2 && y1 === y2) return `${+d1}–${+d2} ${mes(hasta)} ${y2}`;
  return `${+d1} ${mes(desde)} – ${+d2} ${mes(hasta)} ${y2}`;
}

export const dias = (a: Agenda) => [...new Set(a.data.actos.map((x) => x.d))].sort();

export const actosOrdenados = (a: Agenda) =>
  [...a.data.actos].sort((x, y) => (x.d + x.h).localeCompare(y.d + y.h));

export const titlePage = (a: Agenda) =>
  `Agenda cofrade de León · ${rangoCorto(a.data.desde, a.data.hasta)} | El Rincón del Papón`;

/** Descripción para buscadores y previsualizaciones (máx. ~160 caracteres) */
export function descripcion(a: Agenda) {
  if (a.data.descripcion) return a.data.descripcion;
  const n = a.data.actos.length;
  const plural = (t: string) => (/[aeiouáéó]$/.test(t) ? t + 's' : t + 'es');
  const tipos = [...new Set(a.data.actos.map((x) => plural(x.tipo.toLowerCase())))];
  const lista = tipos.length > 1 ? tipos.slice(0, -1).join(', ') + ' y ' + tipos.at(-1) : tipos[0];
  const txt = `${n} actos cofrades en León ${rangoLargo(a.data.desde, a.data.hasta).toLowerCase()}: ${lista}. Horarios, templos y cómo llegar.`;
  return txt.length > 160 ? txt.slice(0, 157).trimEnd() + '…' : txt;
}

export const maps = (lugar: string) =>
  'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(lugar + ', León');

/** Desfase horario de Madrid para esa fecha: "+01:00" o "+02:00" */
function offset(d: string) {
  const s = new Intl.DateTimeFormat('en-US', { timeZone: TZ, timeZoneName: 'longOffset' })
    .formatToParts(at(d))
    .find((p) => p.type === 'timeZoneName')!.value; // "GMT+01:00"
  return s.replace('GMT', '') || '+00:00';
}

/** Datos estructurados schema.org/Event para Google */
export function jsonLd(a: Agenda, url: string, image: string) {
  return a.data.actos.map((x) => ({
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: x.t,
    startDate: `${x.d}T${x.h}:00${offset(x.d)}`,
    eventStatus: 'https://schema.org/EventScheduled',
    eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
    location: {
      '@type': 'Place',
      name: x.lugar,
      address: { '@type': 'PostalAddress', addressLocality: 'León', addressRegion: 'León', addressCountry: 'ES' },
    },
    organizer: { '@type': 'Organization', name: x.hdad },
    description: x.nota ?? `${x.tipo} · ${x.hdad}`,
    image: x.cartel ? new URL(x.cartel.src, url).href : image,
    url,
  }));
}
