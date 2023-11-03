from django.contrib.auth import logout
from django.forms import model_to_dict
from django.template.loader import render_to_string
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from usermanagement.constants import UserConstants, AuthenticationException
from usermanagement.models import CustomUser
from usermanagement.user_manager import SignUpManager, ForgotPasswordManager
from usermanagement.user_query_handler import UserQueryHandler
from utils.Validators import Validators
from utils.constants import UserException
from utils.mail_handler import MailHandler
from utils.otphandler import OTPHandler


@authentication_classes([])
@permission_classes([])
class GenerateOtp(APIView):

    def post(self, request):
        try:
            data = request.data
            email = data.get('email')
            is_signup = data.get('signup')
            user_exists = UserQueryHandler.is_user_exists(email)
            if is_signup and user_exists:
                raise UserException('Email already exists')
            elif not is_signup and not user_exists:
                raise UserException('User doesnot exist')
            otp = OTPHandler(dict(email=email))
            code = otp.generate_otp()
            if is_signup:
                msg = render_to_string('activation_email.html', {'otp': code})
            else:
                msg = render_to_string('sign_in_email.html', {'otp': code})
            MailHandler.custom_send_mail(UserConstants.mail_subject, msg, data.get('email'))
            return Response({'msg': 'success'}, 200)
        except UserException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500, exception=True)


@authentication_classes([])
@permission_classes([])
class VerifyOTP(APIView):

    def post(self, request):
        try:
            data = request.data
            email = data.get('email')
            otp = OTPHandler(dict(email=email))
            otp.verify(data.get('otp'))
            return Response({'msg': 'success', 'email': email}, 200)
        except UserException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500, exception=True)


@authentication_classes([])
@permission_classes([])
class SignUp(APIView):

    def post(self, request):
        try:
            data = request.data
            SignUpManager(data).signup()
            return Response({'msg': 'success'}, 200)
        except UserException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500, exception=True)


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)
        return token

    def validate(self, attrs):
        try:
            data = super().validate(attrs)
            data["success"] = True
            return data
        except Exception as e:
            raise AuthenticationException('Invalid email or password')


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request,  *args, **kwargs):
        try:
            data = request.data
            is_otp = data.get('otp', False)
            if is_otp:
                request.data['password'] = is_otp
            response = super(MyTokenObtainPairView, self).post(request, *args, **kwargs)
            return response
        except Exception as e:
            if request.data.get('otp'):
                return Response('Invalid OTP', 401)
            return Response(str(e), 401)


class SignOut(APIView):

    def get(self, request):
        try:
            logout(request)
            return Response({'success': True}, 200)
        except UserException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500, exception=True)


class GetUserDetails(APIView):
    def get(self, request):
        try:
            user_details = model_to_dict(request.user, exclude=['password', 'is_active', 'modified_at', 'last_login'])
            return Response({'data': user_details}, 200)
        except UserException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500, exception=True)


@authentication_classes([])
@permission_classes([])
class ForgotPassword(APIView):

    def post(self, request):
        try:
            data = request.data
            res = ForgotPasswordManager.forgot_password(data)
            return Response({'msg': 'success', 'success': res}, 200)
        except UserException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500, exception=True)
