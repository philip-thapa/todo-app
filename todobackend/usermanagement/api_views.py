from django.contrib.auth import logout
from django.forms import model_to_dict
from django.template.loader import render_to_string
from rest_framework.decorators import authentication_classes, permission_classes
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

from usermanagement.constants import UserConstants
from usermanagement.jwt_manager import JwtManager
from usermanagement.models import CustomUser
from usermanagement.user_manager import SignUpManager
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
            if data.get('signin'):
                try:
                    CustomUser.objects.get(email=email)
                except Exception as e:
                    raise Exception('User doesnot exist')
            otp = OTPHandler(dict(email=email))
            code = otp.generate_otp()
            msg = render_to_string('activation_email.html', {'otp': code})
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
            otp = request.data.get('otp')
            response = OTPHandler.verify(otp)
            return Response({'success': response}, 200)
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
            otp = OTPHandler(dict(email=data.get('email')))
            otp.verify(data.get('otp'))
            SignUpManager(data).signup()
            return Response({'success': True}, 200)
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
        data = super().validate(attrs)
        # data["user"] = model_to_dict(self.user, exclude=['password'])
        data["success"] = True
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request,  *args, **kwargs):
        try:
            data = request.data
            is_otp = data.get('otp', False)
            if is_otp:
                request.data['password'] = is_otp
            response = super(MyTokenObtainPairView, self).post(request, *args, **kwargs)
            # if not is_otp:
            #     response = super(MyTokenObtainPairView, self).post(request,  *args, **kwargs)
            # else:
            #     response = JwtManager.generate_jwt_token(data.get('email'))
            return response
        except Exception as e:
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
