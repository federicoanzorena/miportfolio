import os

CHAT_TOLERANCIA_MINUTOS = int(os.getenv("CHAT_TOLERANCIA_MINUTOS", "10"))
CHAT_BARRE_SEGUNDOS = int(os.getenv("CHAT_BARRE_SEGUNDOS", "15"))

EMAIL_ENABLED = os.getenv("EMAIL_ENABLED", "false").lower() in ("1", "true", "yes")
RESEND_API_KEY = os.getenv("RESEND_API_KEY", "")
EMAIL_FROM = os.getenv("EMAIL_FROM", "onboarding@resend.dev")
EMAIL_TO_TEAM = os.getenv("EMAIL_TO_TEAM", "anzorenam133@gmail.com")

ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "")
