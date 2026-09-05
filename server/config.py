import os


def _cargar_env_local() -> None:
    """Carga variables de un archivo .env local (solo para desarrollo).

    Solo define variables que aún no existen en el entorno, de modo que en
    producción (Render u otro) las variables reales mantienen prioridad.
    El .env ya está excluido del repositorio (.gitignore).
    """
    ruta = os.path.join(os.path.dirname(__file__), "..", ".env")
    try:
        with open(ruta, encoding="utf-8") as f:
            for linea in f:
                linea = linea.strip()
                if not linea or linea.startswith("#") or "=" not in linea:
                    continue
                clave, _, valor = linea.partition("=")
                clave = clave.strip()
                valor = valor.strip().strip('"').strip("'")
                if clave and clave not in os.environ:
                    os.environ[clave] = valor
    except OSError:
        pass


_cargar_env_local()

CHAT_TOLERANCIA_MINUTOS = int(os.getenv("CHAT_TOLERANCIA_MINUTOS", "10"))
CHAT_BARRE_SEGUNDOS = int(os.getenv("CHAT_BARRE_SEGUNDOS", "15"))

EMAIL_ENABLED = os.getenv("EMAIL_ENABLED", "false").lower() in ("1", "true", "yes")
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "onboarding@resend.dev")
EMAIL_TO_TEAM = os.getenv("EMAIL_TO_TEAM", "anzorenam133@gmail.com")

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")

# Configuración de cookies del panel administrativo.
# Local: Secure=false / SameSite=Lax (HTTP + proxy de Vite).
# Producción (Render): Secure=true / SameSite=None (HTTPS + cross-site).
COOKIE_SECURE = os.getenv("COOKIE_SECURE", "false").lower() in ("1", "true", "yes")
COOKIE_SAMESITE = os.getenv("COOKIE_SAMESITE", "lax").strip().lower()
