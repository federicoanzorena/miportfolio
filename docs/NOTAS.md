# Notas internas

> Notas de mantenimiento para el equipo. Este documento no se despliega en la web publica.

## Panel administrativo (`/panel`)

### Autenticacion y cookies (importante)

El panel autentica mediante la cookie `panel_session`:

- Configurada como `HttpOnly; SameSite=None; Secure` en `server/panel/router.py` (login).
- El frontend (`https://binfinito.com`) y el backend (`https://binfinito-backend.onrender.com`)
  son **cross-site** (no comparten eTLD+1), por lo que `SameSite=None; Secure` es obligatorio
  para que la cookie viaje en las peticiones `fetch` con `credentials: "include"`.

El frontend ya envia `credentials: "include"` en todos los helpers del panel
(`src/utils/agendaApi.ts`: login, estado, logout, listar sumate, listar modificar).

### Advertencia a futuro

Los navegadores estan restringiendo cada vez mas las cookies de terceros
(third-party cookies), incluso con `SameSite=None; Secure`. Como `binfinito.com` vs
`onrender.com` cuenta como cross-site real, si en algun momento el panel deja de
autenticar **sin que cambie nada en el codigo**, este es el primer sospechoso.

**Solucion de fondo** (si llega a pasar): servir la API bajo un subdominio propio
(`api.binfinito.com`) para que panel y API compartan el mismo site, y asi poder volver
a `SameSite=Lax`.

### Base de datos

- `init_db()` en `server/database.py` debe importar **todos** los modelos para que
  `create_all` cree las tablas. Ya incluye `SolicitudModificacion` (tabla `solicitudmodificacion`).
