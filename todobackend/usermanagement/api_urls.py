from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView, TokenObtainPairView

from usermanagement.api_views import (SignUp, MyTokenObtainPairView, SignOut, GetUserDetails, GenerateOtp,
                                      VerifyOTP, ForgotPassword, GetUserProfile, ResetPassword, EditMyProfile)

urlpatterns = [
    path(r'generate-otp', GenerateOtp.as_view(), name='generate-otp'),
    path(r'verify-otp', VerifyOTP.as_view(), name='verify-otp'),
    path(r'sign-up', SignUp.as_view(), name='sign-up'),
    path(r'signin', MyTokenObtainPairView.as_view(), name='signin'),
    path(r'refresh', TokenRefreshView.as_view(), name='refresh'),
    path(r'get-user-details', GetUserDetails.as_view(), name='get-user-details'),
    path(r'sign-out', SignOut.as_view(), name='sign-out'),
    path(r'forgot-password', ForgotPassword.as_view(), name='forgot-password'),
    path(r'get-my-profile', GetUserProfile.as_view(), name='get-my-profile'),
    path(r'reset-password', ResetPassword.as_view(), name='reset-password'),
    path(r'edit-my-profile', EditMyProfile.as_view(), name='edit-my-profile'),
]
