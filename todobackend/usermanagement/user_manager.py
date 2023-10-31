from django.db import IntegrityError

from usermanagement.constants import UserConstants
from usermanagement.models import CustomUser
from utils.Validators import Validators
from utils.constants import UserException


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
