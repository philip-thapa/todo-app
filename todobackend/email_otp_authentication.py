from django.contrib.auth.backends import ModelBackend
from django.contrib.auth.models import User

from usermanagement.models import CustomUser
from utils.otphandler import OTPHandler


class CustomModelBackend(ModelBackend):
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            data = request.data
            is_otp = data.get('otp', False)
            email = data.get('email')
            if not is_otp:
                return None
            otp = OTPHandler(dict(email=email))
            if otp.verify(data.get('otp')):
                return self.get_user(email)
        except User.DoesNotExist:
            raise Exception('User doesnot exist')
        except Exception as e:
            raise Exception('Invalid OTP')

    def get_user(self, email):
        try:
            return CustomUser.objects.get(email=email)
        except User.DoesNotExist:
            return None
