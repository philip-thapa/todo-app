from django.db import IntegrityError
from django.forms import model_to_dict
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


class UserAccountManager:

    def __init__(self, email=None):
        self.user = None
        if email:
            try:
                self.user = CustomUser.objects.get(email=email)
            except Exception as e:
                raise UserException('User doesnot exist')

    def get_user_details(self):
        user = model_to_dict(self.user,
                             exclude=['id', 'password', 'last_login', 'is_active', 'modified_at'])
        user['created_at'] = user.pop('created_at').date()
        full_name = user.get('firstname')
        if user.get('lastname'):
            full_name += " " + user.get('lastname')
        user['full_name'] = full_name
        return user

    def edit_my_profile(self, payload):
        firstname = payload.get('firstName', '').strip()
        lastname = payload.get('lastName', '').strip()
        phone = payload.get('phone', '').strip()
        gender = payload.get('gender', '').strip()
        if firstname:
            self.user.firstname = firstname
        if lastname:
            self.user.lastname = lastname
        if phone:
            if not Validators.phone_validator(phone):
                raise UserException('Invalid Phone Number')
            self.user.phone = phone
        if gender:
            if gender not in UserConstants.GENDER_TYPES:
                raise UserException('Invalid Gender type')
            self.user.gender = gender
        self.user.save()


class ResetPasswordManager:

    def __init__(self, email=None):
        self.user = None
        try:
            self.user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist as e:
            raise UserException('Email doesnot exist')

    def reset_password(self, payload):
        old_password = payload.get('password').strip()
        if not old_password:
            raise UserException('Please provide old password')
        new_password = payload.get('newPassword').strip()
        confirm_password = payload.get('confirmPassword').strip()
        if len(new_password) < 5:
            raise UserException('Password length must be greater than or equal to 5 char')
        if new_password != confirm_password:
            raise UserException('Password doesnot match')
        if not self.user.check_password(old_password):
            raise UserException('Invalid Password')
        self.user.set_password(new_password)
        self.user.save()
