# Invitación — Mis XV de Alma

Invitación web responsive para el 12 de diciembre de 2026.

## Desarrollo local

Requiere Node.js 22.

```bash
npm install
npm run dev
```

## Publicar con GitHub y Netlify

1. Subí esta carpeta a un repositorio de GitHub.
2. En Netlify elegí **Add new site → Import an existing project**.
3. Conectá el repositorio. Netlify leerá `netlify.toml` y utilizará automáticamente `npm run build`.
4. Publicá el sitio.

No hace falta configurar variables de entorno. Netlify aporta la variable `URL`, usada para generar correctamente la vista previa al compartir el enlace.

## Datos a personalizar

La fecha configurada es **12/12/2026 a las 21:00 (Argentina)**. Los enlaces de calendario, ubicación y confirmación están en `app/page.tsx`.
