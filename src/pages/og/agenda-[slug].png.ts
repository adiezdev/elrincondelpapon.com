// Genera en el build la imagen de previsualización (1200x630) de cada agenda: /og/agenda-<slug>.png
import type { APIRoute } from 'astro';
import fs from 'node:fs/promises';
import path from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';
import { actosOrdenados, dias, getAgendas, nombreDia, rangoLargo, type Agenda } from '../../lib/agenda';

export async function getStaticPaths() {
  const agendas = await getAgendas();
  return agendas.map((agenda) => ({ params: { slug: agenda.id }, props: { agenda } }));
}

const fontDir = path.join(process.cwd(), 'node_modules/@fontsource/inter/files');
const font = (w: number) => fs.readFile(path.join(fontDir, `inter-latin-${w}-normal.woff`));

// Mini helper para no usar JSX
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, ...children: (Node | string)[]): Node => ({
  type,
  props: { style: { display: 'flex', ...style }, children: children.length === 1 ? children[0] : children },
});

const MORADO = 'rgb(136,58,234)';
const LILA = 'rgb(224,204,250)';
const GRIS = '#979797';

export const GET: APIRoute = async ({ props }) => {
  const agenda = (props as { agenda: Agenda }).agenda;
  const ordenados = actosOrdenados(agenda);
  const listaDias = dias(agenda);

  const filaDia = (d: string) => {
    const actos = ordenados.filter((a) => a.d === d);
    const primero = actos[0];
    return h(
      'div',
      { flexDirection: 'column', padding: '18px 0', borderTop: '1px solid #404040' },
      h('div', { justifyContent: 'space-between', alignItems: 'baseline' },
        h('div', { fontSize: 34, fontWeight: 800, color: '#fff' }, nombreDia(d)),
        h('div', { fontSize: 26, color: LILA }, `${actos.length} ${actos.length === 1 ? 'acto' : 'actos'}`),
      ),
      h('div', { fontSize: 24, color: GRIS, marginTop: 6 },
        `${primero.h} · ${primero.t.length > 34 ? primero.t.slice(0, 33).trimEnd() + '…' : primero.t}`),
    );
  };

  const extra = agenda.data.permanentes.length ? ` · + ${agenda.data.permanentes.length} todos los días` : '';

  const tree = h(
    'div',
    { width: 1200, height: 630, background: '#262626', fontFamily: 'Inter', color: '#fff' },
    // franja lateral morada
    h('div', { width: 18, height: '100%', background: MORADO }),
    h(
      'div',
      { flex: 1, padding: '56px 64px', gap: 56 },
      // columna izquierda
      h(
        'div',
        { flexDirection: 'column', justifyContent: 'space-between', width: 470 },
        h('div', { flexDirection: 'column' },
          h('div', { fontSize: 26, fontWeight: 700, color: LILA }, 'El Rincón del Papón'),
          h('div', { fontSize: 76, fontWeight: 800, lineHeight: 1.02, marginTop: 22, letterSpacing: -1.5 }, 'Agenda cofrade'),
          h('div', { fontSize: 76, fontWeight: 800, lineHeight: 1.02, color: LILA, letterSpacing: -1.5 }, 'de León'),
          h('div', { fontSize: 30, color: GRIS, marginTop: 26, lineHeight: 1.3 }, rangoLargo(agenda.data.desde, agenda.data.hasta)),
        ),
        h('div', { fontSize: 26, color: '#fff', background: MORADO, padding: '12px 22px', borderRadius: 999, alignSelf: 'flex-start' },
          'elrincondelpapon.com/agenda'),
      ),
      // columna derecha
      h(
        'div',
        { flexDirection: 'column', flex: 1, justifyContent: 'center' },
        h('div', { fontSize: 26, color: GRIS, marginBottom: 6 }, `${agenda.data.actos.length} actos${extra}`),
        ...listaDias.slice(0, 4).map(filaDia),
      ),
    ),
  );

  const svg = await satori(tree as never, {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Inter', data: await font(400), weight: 400, style: 'normal' },
      { name: 'Inter', data: await font(700), weight: 700, style: 'normal' },
      { name: 'Inter', data: await font(800), weight: 800, style: 'normal' },
    ],
  });
  const png = new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();

  return new Response(png, { headers: { 'Content-Type': 'image/png' } });
};
