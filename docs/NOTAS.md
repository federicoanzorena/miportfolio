# Notas internas

> Notas de mantenimiento para el equipo. Este documento no se despliega en la web publica.

## Panel administrativo (`/panel`)

### Autenticacion y cookies (importante)

El panel autentica mediante la cookie `panel_session` (`HttpOnly`):

- **Produccion (Render):** `SameSite=None; Secure`. El frontend
  (`https://binfinito.com`) y el backend (`https://binfinito-backend.onrender.com`)
  son **cross-site** (no comparten eTLD+1), por lo que `SameSite=None; Secure` es
  obligatorio para que la cookie viaje en las peticiones `fetch` con
  `credentials: "include"`.
- **Local:** `SameSite=Lax; Secure=false`. Como se usa el proxy de Vite
  (`/api` -> `localhost:8000`), frontend y backend se ven como mismo-origen, y
  la cookie viaja por HTTP.

El valor de `SameSite`/`Secure` lo deciden las variables (definidas en
`server/config.py`):

- `COOKIE_SAMESITE=lax` (default) / `COOKIE_SECURE=false` (default) → local.
- En Render se setean explícitamente `COOKIE_SAMESITE=none` / `COOKIE_SECURE=true`.

El frontend ya envia `credentials: "include"` en todos los helpers del panel
(`src/shared/api/agendaApi.ts`: login, estado, logout, listar sumate, listar modificar).

### Desarrollo local

Levantar todo sin depender de Netlify/Render:

```bash
# 1. Backend FastAPI (local) — lee server/.env (o el .env de la raiz)
uvicorn server.main:app --port 8000
#   Requiere en .env: ADMIN_PASSWORD, y por default COOKIE_SECURE=false
#   y COOKIE_SAMESITE=lax (ya vienen asi, no hace falta escribirlos).

# 2. Frontend Vite (usa el proxy /api -> :8000)
npm run dev
```

- Acceder a `http://localhost:5173` y a `http://localhost:5173/panel`.
- `VITE_API_BASE` se deja **vacio** para que el frontend use el proxy de Vite
  (no apuntar manualmente a Render).
- Ver `README.md` -> seccion "Reactivacion" y "Entornos".

### Advertencia a futuro

Los navegadores estan restringiendo cada vez mas las cookies de terceros
(third-party cookies), incluso con `SameSite=None; Secure`. Como `binfinito.com` vs
`onrender.com` cuenta como cross-site real, si en algun momento el panel deja de
autenticar **sin que cambie nada en el codigo**, este es el primer sospechoso.

**Solucion de fondo** (si llega a pasar): servir la API bajo un subdominio propio
(`api.binfinito.com`) para que panel y API compartan el mismo site, y asi poder volver
a `SameSite=Lax`.

### Base de datos

- `init_db()` en `server/database.py` importa los modelos de los features activos
  para que `create_all` cree las tablas. Actualmente: `SolicitudModificacion`,
  `SolicitudCambio`, `EventoHistorial` y `SolicitudSumate`. Los modelos de `agenda`
  y `chat` **no** se importan (features desmontados; ver seccion mas abajo).

### SQLite local vs PostgreSQL de produccion

- **Local:** usa SQLite (`sqlite:///./binfinito.db`, archivo en la raiz del repo) por
  defecto si no hay `DATABASE_URL`. Ideal para pruebas: cero config, aislado y portable.
- **Produccion (Render):** usa PostgreSQL vía `DATABASE_URL`.

Son bases **separadas**: lo que cargues en el panel local (Sumate/Modificar) queda en
`binfinito.db` y **no** aparece en produccion, y viceversa. Si necesitas ver los datos
reales de produccion, proba el panel en `https://binfinito.com/panel` (el backend de
Render sigue activo aunque el deploy de Netlify este pausado).

- Para resetear las pruebas locales: borrar `binfinito.db` y reiniciar el backend
  (el `init_db()` recrea las tablas vacias). No afecta a produccion.
- El archivo `*.db` esta en `.gitignore` (no se sube al repo).

## Arquitectura del backend (server/)

Estructura feature-first: cada feature es un paquete con `router.py` (solo transporte HTTP),
`service.py` (logica + persistencia), `models.py` y, si aplica, `schemas.py`. La direccion de
dependencias es:

```
main.py -> routers -> services -> models / database
```

- `server/security.py` centraliza `_exigir_admin`, `es_token_admin`, `crear_token_admin`
  y los tokens de turno. Los routers NO hacen SQL directo (todo vive en los `service.py`).
- Features activos montados en `main.py`: `sumate`, `modificar`, `panel`, `solicitudes_cambio`.
- `panel` delega en los services de `sumate`/`modificar` para sus listados (no toca SQL ni
  modelos ajenos). Las rutas `/panel/solicitudes-*` se mantienen (no se trasladaron).

### Features desmontados: agenda y chat

`agenda` y `chat` se disenaron para seguir trabajandose pero **no se continuaron**: no tienen
ningun consumidor en el frontend (`src/` no los referencia) ni la web publica los promete.
Para no pagar costo de ejecucion ni superficie de mantenimiento por features huerfanos, se
decidio **desmontarlos** (no borrarlos):

- Los routers **ya no se montan** en `main.py` (antes: `agenda_router`, `chat_router`).
- El `supervisor_loop` del chat (que corria en `lifespan`) **ya no se crea**.
- Sus modelos **ya no se importan** en `init_db()`.
- **El codigo se conserva intacto** en `server/agenda/` y `server/chat/` (incluidas sus
  dependencias: `agenda/utils.py`, `chat/manager.py`), listo para retomar sin reescribir.

**Para reactivarlos** si se retoman: importar los routers en `main.py`, re-registrarlos con
`app.include_router`, crear la tarea `supervisor_loop` en `lifespan` y volver a importar sus
modelos en `init_db()`. Requiere ademas darles un consumidor real en el frontend.

Nota: ambas arquitecturas ya estan refactorizadas a servicio (router -> service -> models),
por lo que reactivarlas no implica reordenar codigo.

## Arquitectura del frontend (src/)

El frontend tambien es feature-first, organizado en tres cajas:

- `src/app/` — bootstrap y estructura del sitio: `main.tsx`, `App.tsx` (router con
  lazy-loading por feature), `layout/` (Navbar, Footer, Layout), `pages/NotFoundPage.tsx`
  e `index.css`.
- `src/features/<feature>/` — una carpeta por ruta publica (kebab-case, igual que la URL:
  `que-entrego`, `arquitectura`, `modificar`...). Cada feature contiene su pagina, sus
  componentes propios en `components/` y su barrel.
- `src/shared/` — lo que usan varias features: `ui/` (primitivas), `lib/` (cn, backendBase,
  brand), `hooks/`, `data/content.ts` (textos centralizados), `api/agendaApi.ts`,
  `types/` (index, panel) y `assets/`.

Los imports usan aliases (configurados en `tsconfig.app.json` y `vite.config.ts`), no
relativos con profundidad variable: `@app/*`, `@features/*`, `@shared/*`.

### Reglas

- Cada feature expone un `index.ts` (barrel) que re-exporta **solo su pagina**. Asi el
  lazy-loading de `App.tsx` (import dinamico con `.then({ default: m.X })`) mantiene un
  chunk por feature. No usar `export *` del interior de la feature.
- `solicitudes` es la excepcion (feature-library): no tiene ruta propia, su barrel exporta
  `SolicitudesPanel`, que es consumido por `panel`.
- Una feature no importa el interior de otra por ruta profunda; el cruce permitido
  (panel -> solicitudes) va por el barrel.
- Los tipos compartidos entre features viven en `src/shared/types/`. Los que usa una sola
  feature viven dentro de ella (ej. `features/solicitudes/types.ts`).

