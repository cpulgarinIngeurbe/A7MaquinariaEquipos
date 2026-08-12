# A7MaquinariaEquipos — Control Maquinaria

Sitio web estático (HTML/CSS/JavaScript vanilla, sin dependencias ni build) que replica el
prototipo interactivo **Control Maquinaria** de Ingeurbe: control de maquinaria y equipos
en obra (dashboard, listado, ficha de equipo, registro de movimientos, escaneo QR, alertas
de mantenimiento/alquiler y reportes de uso).

## Estructura

```
index.html          Shell de la página y marco de teléfono
css/
  colors_and_type.css  Tokens de marca (Ingeurbe Design System)
  styles.css           Estilos de página, marco de teléfono y animaciones
js/
  app.js               Estado, datos de demostración y render de las 7 pantallas
assets/
  ingeurbe-app.png     Logo
```

Los datos de equipos, alertas y reportes son de demostración (hardcodeados en `js/app.js`),
igual que en el prototipo original.

## Ejecutar en local

No requiere build ni instalación. Basta un servidor estático:

```bash
python -m http.server 8080
# abrir http://localhost:8080
```

## Despliegue en GitHub Pages

El repositorio incluye el workflow [`.github/workflows/deploy-pages.yml`](.github/workflows/deploy-pages.yml),
que publica el sitio automáticamente en cada push a `main`.

Para activarlo (solo la primera vez):

1. Ve a **Settings → Pages** en este repositorio.
2. En **Build and deployment → Source**, selecciona **GitHub Actions**.
3. Haz push a `main` (o ejecuta el workflow manualmente desde la pestaña **Actions**).

El sitio quedará disponible en `https://cpulgariningeurbe.github.io/A7MaquinariaEquipos/`.
