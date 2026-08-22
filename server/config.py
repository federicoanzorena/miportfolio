import os

CHAT_TOLERANCIA_MINUTOS = int(os.getenv("CHAT_TOLERANCIA_MINUTOS", "10"))
CHAT_BARRE_SEGUNDOS = int(os.getenv("CHAT_BARRE_SEGUNDOS", "15"))

SMTP_ENABLED = os.getenv("SMTP_ENABLED", "false").lower() in ("1", "true", "yes")
SMTP_HOST = os.getenv("SMTP_HOST", "")
SMTP_PORT = int(os.getenv("SMTP_PORT", "465"))
SMTP_USER = os.getenv("SMTP_USER", "")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "")
SMTP_FROM = os.getenv("SMTP_FROM", "")
SMTP_FROM_NAME = os.getenv("SMTP_FROM_NAME", "binfinito")
SMTP_TIMEOUT_SEGUNDOS = int(os.getenv("SMTP_TIMEOUT_SEGUNDOS", "10"))
