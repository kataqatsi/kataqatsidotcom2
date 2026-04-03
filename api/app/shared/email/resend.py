import resend
from settings import Config

resend.api_key = Config.resend_api_key


def send_otp_email(email: str, code: str):
    try:
        response = resend.Emails.send(
            {
                "from": "Sinewax <otp@otp.sinewax.com>",
                "to": [email],
                "subject": "Login Code",
                "html": f"Login Code: <span style='font-size: 24px; font-weight: bold; background-color: #f0f0f0; padding: 10px; border-radius: 5px; color: #000;'>{code}</span>",
            }
        )
        return response
    except Exception as e:
        print(e)
        return False
