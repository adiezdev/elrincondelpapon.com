// Agenda cofrade: un objeto por acto.
// Para añadir actos, copia una línea y cambia los datos. El orden da igual: la página ordena por día y hora.
//   d     → fecha AAAA-MM-DD
//   h     → hora HH:MM
//   t     → nombre del acto
//   hdad  → hermandad / cofradía / organizador
//   lugar → templo o sitio (se usa para el enlace a Google Maps)
//   tipo  → Culto, Besamanos, Procesión, Concierto, Presentación...
//   nota  → opcional

export interface Acto {
  d: string;
  h: string;
  t: string;
  hdad: string;
  lugar: string;
  tipo: string;
  nota?: string;
}

export const titulo = 'Agenda cofrade del fin de semana';
export const subtitulo = 'Del viernes 20 al domingo 22 de noviembre de 2026';

// TODO: sustituir por los actos reales de los carteles
export const actos: Acto[] = [
  { d: '2026-11-20', h: '19:30', t: 'Triduo – primer día', hdad: 'Cofradía de ejemplo A', lugar: 'Iglesia de San Marcelo', tipo: 'Culto' },
  { d: '2026-11-20', h: '20:30', t: 'Concierto de marchas', hdad: 'Banda de ejemplo', lugar: 'Teatro El Albéitar', tipo: 'Concierto' },
  { d: '2026-11-21', h: '12:00', t: 'Besamanos', hdad: 'Cofradía de ejemplo B', lugar: 'Basílica de San Isidoro', tipo: 'Besamanos', nota: 'Hasta las 14:00' },
  { d: '2026-11-21', h: '19:00', t: 'Triduo – segundo día', hdad: 'Cofradía de ejemplo A', lugar: 'Iglesia de San Marcelo', tipo: 'Culto' },
  { d: '2026-11-22', h: '12:30', t: 'Función principal', hdad: 'Cofradía de ejemplo A', lugar: 'Iglesia de San Marcelo', tipo: 'Culto' },
  { d: '2026-11-22', h: '18:00', t: 'Procesión extraordinaria', hdad: 'Cofradía de ejemplo C', lugar: 'Catedral de León', tipo: 'Procesión', nota: 'Salida desde la Puerta del Perdón' },
];
