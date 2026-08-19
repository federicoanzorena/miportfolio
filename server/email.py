import logging
import smtplib
from datetime import datetime
from email.message import EmailMessage
from email.utils import formataddr

from . import config

logger = logging.getLogger(__name__)

PUERTO_SSL = 465


def _armar_mensaje(turno, inicio, fin, token) -> EmailMessage:
    destino = formataddr((turno.nombre_visitante, turno.email_visitante))
    remitente = formataddr((config.SMTP_FROM_NAME, config.SMTP_FROM))

    mensaje = EmailMessage()
    mensaje["Subject"] = "Tu turno con binfinito está confirmado"
    mensaje["From"] = remitente
    mensaje["To"] = destino

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

    mensaje.set_content(texto)
    mensaje.add_alternative(html, subtype="html")
    return mensaje


def _conectar() -> smtplib.SMTP:
    if config.SMTP_PORT == PUERTO_SSL:
        if config.SMTP_STARTTLS:
            logger.info(
                "Puerto %s: se usa SMTP_SSL, SMTP_STARTTLS se ignora",
                config.SMTP_PORT,
            )
        return smtplib.SMTP_SSL(
            config.SMTP_HOST,
            config.SMTP_PORT,
            timeout=config.SMTP_TIMEOUT_SEGUNDOS,
        )

    cliente = smtplib.SMTP(
        config.SMTP_HOST,
        config.SMTP_PORT,
        timeout=config.SMTP_TIMEOUT_SEGUNDOS,
    )
    if config.SMTP_STARTTLS:
        cliente.starttls()
    return cliente


def enviar_email_confirmacion(turno, inicio, fin, token) -> None:
    """Envía la confirmación del turno por SMTP (best-effort).

    Si SMTP no está habilitado o el envío falla, se loguea el error y no se
    propaga para no romper la confirmación del turno.
    """
    if not config.SMTP_ENABLED:
        logger.info("SMTP_ENABLED=false: se omite el envío del email")
        return

    try:
        mensaje = _armar_mensaje(turno, inicio, fin, token)
        with _conectar() as cliente:
            if config.SMTP_USER:
                cliente.login(config.SMTP_USER, config.SMTP_PASSWORD)
            cliente.send_message(mensaje)
    except Exception:
        logger.exception("Fallo el envío del email de confirmación")


def _armar_mensaje_sumate(nombre: str, email: str) -> EmailMessage:
    destino = config.SMTP_FROM or "anzorenam133@gmail.com"
    remitente = formataddr((config.SMTP_FROM_NAME, config.SMTP_FROM))

    mensaje = EmailMessage()
    mensaje["Subject"] = f"Nuevo interés en sumarse al equipo: {nombre}"
    mensaje["From"] = remitente
    mensaje["To"] = destino
    mensaje["Reply-To"] = formataddr((nombre, email))

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

    mensaje.set_content(texto)
    mensaje.add_alternative(html, subtype="html")
    return mensaje


def enviar_email_sumate(nombre: str, email: str) -> None:
    """Notifica al equipo cuando alguien quiere sumarse (best-effort)."""
    if not config.SMTP_ENABLED:
        logger.info(
            "SMTP_ENABLED=false: se omite el email de sumate (%s <%s>)",
            nombre,
            email,
        )
        return

    try:
        mensaje = _armar_mensaje_sumate(nombre, email)
        with _conectar() as cliente:
            if config.SMTP_USER:
                cliente.login(config.SMTP_USER, config.SMTP_PASSWORD)
            cliente.send_message(mensaje)
    except Exception:
        logger.exception("Fallo el envío del email de sumate")
