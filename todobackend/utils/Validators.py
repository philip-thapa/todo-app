import re


class Validators:

    @staticmethod
    def email_validator(email):
        pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
        return bool(re.match(pattern, email))

    @staticmethod
    def phone_validator(phone):
        pattern = r'^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$'
        return bool(re.match(pattern, phone))