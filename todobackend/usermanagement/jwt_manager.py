import jwt


class JwtManager:

    @staticmethod
    def generate_jwt_token(user):
        payload = {
            'user_id': user,
            # Add any other information you want to include in the token
        }
        return jwt.encode(payload, 'your_secret_key', algorithm='HS256')