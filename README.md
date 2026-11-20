# El Rincón del Papón

## Agendas cofrades

Cada agenda es un JSON en `src/content/agenda/`. El nombre del archivo es su URL:
`src/content/agenda/2026-11-20.json` → `elrincondelpapon.com/agenda/2026-11-20/`.

- `elrincondelpapon.com/agenda/` muestra siempre la agenda más reciente (por `desde`). Es el enlace fijo para compartir.
- La imagen de previsualización (`/og/agenda-<nombre>.png`, 1200x630) se genera sola en el build.
- El esquema está en `src/content/config.ts`: si falta un campo o una fecha/hora está mal, el build falla.

Carteles: guarda la imagen en `src/assets/agenda/<nombre-agenda>/` y pon en el acto `"cartel": "../../assets/agenda/<nombre-agenda>/archivo.jpg"`. Astro la optimiza a WebP sola.

Para una agenda nueva: copia el último JSON, cámbiale el nombre a la fecha de inicio y edita `desde`, `hasta`, `actos` y `permanentes`.

Si la previsualización de un enlace ya compartido no se actualiza, fuerza el refresco en
https://developers.facebook.com/tools/debug/ (sirve también para WhatsApp e Instagram).

---

# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   └── Card.astro
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).
