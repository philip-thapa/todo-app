from django.db import IntegrityError
from django.template.loader import render_to_string

from usermanagement.constants import UserConstants
from usermanagement.models import CustomUser
from usermanagement.user_query_handler import UserQueryHandler
from utils.Validators import Validators
from utils.constants import UserException
from utils.mail_handler import MailHandler
from utils.otphandler import OTPHandler


class SignUpManager:

    def __init__(self, payload):
        self.email = payload['email'].strip()
        self.password = payload['password'].strip()
        self.phone = payload.get('phone', '').strip()
        self.gender = payload.get('gender', '').strip()
        self.first_name = payload.get('firstName', '').strip()
        self.last_name = payload.get('lastName', '').strip()

    def validate_payload(self):
        if len(self.password.strip()) < 5:
            raise UserException('Passoword too short. Minimum 5 char is requied')
        if not Validators.email_validator(self.email.strip()):
            raise UserException('Invalid Email format')
        if self.phone and not Validators.phone_validator(self.phone.strip()):
            raise UserException('Invalid phone number')
        if self.gender.strip() and self.gender.strip() not in UserConstants.GENDER_TYPES:
            raise UserException('Invalid gender type')
        if not self.first_name.strip():
            raise UserException('First name is required')

    def signup(self):
        SignUpManager.validate_payload(self)
        try:
            CustomUser.objects.create_user(
                email=self.email,
                password=self.password,
                phone=self.phone,
                firstname=self.first_name,
                lastname=self.last_name,
                gender=self.gender
            )
            return
        except IntegrityError as e:
            raise UserException('User account already exists')


class ForgotPasswordManager:

    @staticmethod
    def forgot_password(data):
        email = data.get('email')
        otp = data.get('otp')
        if not Validators.email_validator(email):
            return UserException('Invalid email')
        if not otp and not UserQueryHandler.is_user_exists(email):
            raise UserException('User doesnot exist')
        otp_instance = OTPHandler(dict(email=email))
        if not otp:
            code = otp_instance.generate_otp()
            msg = render_to_string('forgot_password.html', {'otp': code})
            if MailHandler.custom_send_mail(UserConstants.mail_subject, msg, email):
                return None
        else:
            if not otp_instance.verify(otp):
                raise UserException('Invalid OTP')
            password = data.get('password').strip()
            if len(password) < 5:
                raise Exception('Min 5 char is required')
            if password != data.get('confirmPassword'):
                raise UserException('Passwords doesnot match')
            try:
                user = CustomUser.objects.get(email=email)
                user.set_password(password)
                user.save()
                return True
            except Exception as e:
                raise UserException('Invalid email')
