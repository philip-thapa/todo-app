from usermanagement.models import CustomUser


class UserQueryHandler:

    @staticmethod
    def is_user_exists(email):
        return CustomUser.objects.filter(email=email).exists()
