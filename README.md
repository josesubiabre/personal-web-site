# Portafolio de arte — José Subiabre

App React (Vite + TypeScript + Tailwind 4, estructura shadcn) con un landing
animado por scroll: las obras forman un arco, y al hacer clic en una se
expande a pantalla completa.

## Cómo trabajar

```bash
npm install      # solo la primera vez
npm run dev      # servidor de desarrollo (http://localhost:5173)
npm run build    # genera la versión final en dist/
```

- **Landing**: edita `src/components/ui/scroll-morph-hero.tsx` (textos e
  imágenes están al inicio del archivo, en la lista `IMAGES`) y `src/App.tsx`
  (cabecera y navegación).

## Cómo añadir tus obras

1. Copia tus imágenes (`.jpg`, `.png`…) a la carpeta `public/obras/`.
2. Abre `src/components/ui/scroll-morph-hero.tsx` y reemplaza las URLs de la
   lista `IMAGES` por rutas como `obras/mi-foto.jpg`.

Consejo: exporta las imágenes a ~1600 px de ancho para que carguen rápido.

## Personalizar textos

- **Nombre y navegación**: `src/App.tsx`.
- **Titular y textos del hero**: `src/components/ui/scroll-morph-hero.tsx`.
- **Título de la pestaña**: `index.html`.

## Publicar en internet (GitHub Pages)

El despliegue es automático: cada vez que un cambio llega a `main`, se
ejecuta el workflow de GitHub Actions (`.github/workflows/deploy.yml`), que
compila la app con Vite y publica `dist/` en
`https://josesubiabre.github.io/portfolio-arte/`.

**`main` está protegida**: no se puede hacer `git push` directo. Todo cambio
se sube por rama y Pull Request.

Para publicar cambios:

```bash
git checkout -b nombre-del-cambio
# ... editás y probás con npm run dev ...
git add .
git commit -m "descripción del cambio"
git push -u origin nombre-del-cambio
```

Después abrí un Pull Request en GitHub hacia `main` y usá **"Squash and
merge"**. A los 1–2 minutos de mergear, el sitio queda actualizado.
