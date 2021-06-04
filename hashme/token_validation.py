from decouple import config
import hashlib


def validate(token):
    real_token = config('API_TOKEN', cast=str)

    if token == real_token:
        return True
    else:
        return False

