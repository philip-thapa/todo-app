from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User

from usermanagement.models import CustomUser
from utils.otphandler import OTPHandler


class CustomModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            data = request.data
            is_otp = data.get('otp', False)
            if not is_otp:
                return None
            otp = OTPHandler(dict(email=data.get('email')))
            otp.verify(data.get('otp'))
            return self.get_user(data.get('email'))
        except User.DoesNotExist:
            return None

    def get_user(self, email):
        try:
            return CustomUser.objects.get(email=email)
        except User.DoesNotExist:
            return None
