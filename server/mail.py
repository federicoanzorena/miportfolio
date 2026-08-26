import logging
from datetime import datetime

import resend

from . import config

logger = logging.getLogger(__name__)

resend.api_key = config.RESEND_API_KEY


def _enviar(params: dict) -> None:
    """Envía un email vía Resend (best-effort)."""
    if not config.EMAIL_ENABLED:
        logger.info("EMAIL_ENABLED=false: se omite el envío del email")
        return

    try:
        resend.Emails.send(params)
    except Exception:
        logger.exception("Fallo el envío del email")


def enviar_email_confirmacion(turno, inicio, fin, token) -> None:
    """Envía la confirmación del turno al visitante."""
    texto = (
        f"Hola {turno.nombre_visitante},\n\n"
        f"Tu turno fue confirmado.\n\n"
        f"Sala: {turno.sala_id}\n"
        f"Clave de acceso: {token}\n"
        f"Disponible desde: {inicio:%d/%m/%Y %H:%M}\n"
        f"Hasta: {fin:%d/%m/%Y %H:%M}\n\n"
        "Guardá estos datos para entrar al chat cuando llegue el momento.\n"
        "Equipo binfinito"
    )
    html = (
        "<html><body style='font-family:sans-serif;color:#18181b'>"
        f"<h2>Tu turno con binfinito está confirmado</h2>"
        f"<p>Hola {turno.nombre_visitante},</p>"
        "<dl>"
        f"<dt><b>Sala</b></dt><dd><code>{turno.sala_id}</code></dd>"
        f"<dt><b>Clave de acceso</b></dt><dd><code>{token}</code></dd>"
        f"<dt><b>Disponible desde</b></dt><dd>{inicio:%d/%m/%Y %H:%M}</dd>"
        f"<dt><b>Hasta</b></dt><dd>{fin:%d/%m/%Y %H:%M}</dd>"
        "</dl>"
        "<p>Guardá estos datos para entrar al chat cuando llegue el momento.</p>"
        "<p>Equipo binfinito</p>"
        "</body></html>"
    )

    _enviar({
        "from": config.EMAIL_FROM,
        "to": [turno.email_visitante],
        "subject": "Tu turno con binfinito está confirmado",
        "text": texto,
        "html": html,
    })


def enviar_email_sumate(nombre: str, email: str) -> None:
    """Notifica al equipo cuando alguien quiere sumarse."""
    destino = config.EMAIL_TO_TEAM
    texto = (
        f"Alguien quiere sumarse al equipo binfinito.\n\n"
        f"Nombre: {nombre}\n"
        f"Email: {email}\n"
        f"Fecha: {datetime.now().astimezone().strftime('%d/%m/%Y %H:%M')}\n"
    )
    html = (
        "<html><body style='font-family:sans-serif;color:#18181b'>"
        "<h2>Nuevo interés en sumarse al equipo</h2>"
        "<dl>"
        f"<dt><b>Nombre</b></dt><dd>{nombre}</dd>"
        f"<dt><b>Email</b></dt><dd><a href='mailto:{email}'>{email}</a></dd>"
        f"<dt><b>Fecha</b></dt><dd>{datetime.now().astimezone().strftime('%d/%m/%Y %H:%M')}</dd>"
        "</dl>"
        "</body></html>"
    )

    _enviar({
        "from": config.EMAIL_FROM,
        "to": [destino],
        "reply_to": email,
        "subject": f"Nuevo interés en sumarse al equipo: {nombre}",
        "text": texto,
        "html": html,
    })


def enviar_email_modificacion(
    nombre: str,
    email: str,
    url_sitio: str,
    que_cambiar: str,
    prioridades: str,
    presupuesto: str,
    plazos: str,
    detalles_tecnicos: str,
) -> None:
    """Notifica al equipo cuando alguien solicita modificar su sitio."""
    destino = config.EMAIL_TO_TEAM
    texto = (
        f"Nueva solicitud de modificación de sitio.\n\n"
        f"Nombre: {nombre}\n"
        f"Email: {email}\n"
        f"URL del sitio: {url_sitio}\n"
        f"Qué quiere cambiar: {que_cambiar}\n"
        f"Prioridades: {prioridades}\n"
        f"Presupuesto: {presupuesto}\n"
        f"Plazos: {plazos}\n"
        f"Detalles técnicos: {detalles_tecnicos or 'No especificados'}\n"
        f"Fecha: {datetime.now().astimezone().strftime('%d/%m/%Y %H:%M')}\n"
    )
    html = (
        "<html><body style='font-family:sans-serif;color:#18181b'>"
        "<h2>Nueva solicitud de modificación de sitio</h2>"
        "<dl>"
        f"<dt><b>Nombre</b></dt><dd>{nombre}</dd>"
        f"<dt><b>Email</b></dt><dd><a href='mailto:{email}'>{email}</a></dd>"
        f"<dt><b>URL del sitio</b></dt><dd><a href='{url_sitio}' target='_blank'>{url_sitio}</a></dd>"
        f"<dt><b>Qué quiere cambiar</b></dt><dd>{que_cambiar}</dd>"
        f"<dt><b>Prioridades</b></dt><dd>{prioridades}</dd>"
        f"<dt><b>Presupuesto</b></dt><dd>{presupuesto}</dd>"
        f"<dt><b>Plazos</b></dt><dd>{plazos}</dd>"
        f"<dt><b>Detalles técnicos</b></dt><dd>{detalles_tecnicos or 'No especificados'}</dd>"
        f"<dt><b>Fecha</b></dt><dd>{datetime.now().astimezone().strftime('%d/%m/%Y %H:%M')}</dd>"
        "</dl>"
        "</body></html>"
    )

    _enviar({
        "from": config.EMAIL_FROM,
        "to": [destino],
        "reply_to": email,
        "subject": f"Nueva solicitud de modificación: {url_sitio}",
        "text": texto,
        "html": html,
    })
