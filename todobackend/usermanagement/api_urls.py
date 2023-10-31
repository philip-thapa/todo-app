from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from usermanagement.api_views import SignUp, MyTokenObtainPairView, SignOut, GetUserDetails, GenerateOtp, VerifyOTP

urlpatterns = [
    path(r'generate-otp', GenerateOtp.as_view(), name='generate-otp'),
    path(r'verify-otp', VerifyOTP.as_view(), name='verify-otp'),
    path(r'sign-up', SignUp.as_view(), name='sign-up'),
    path(r'signin', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path(r'refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path(r'get-user-details', GetUserDetails.as_view(), name='sign-out'),
    path(r'sign-out', SignOut.as_view(), name='sign-out')
]
