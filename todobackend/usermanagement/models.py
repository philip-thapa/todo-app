from django.contrib.auth.base_user import AbstractBaseUser
from django.contrib.auth.models import AbstractUser
from django.db import models
from datetime import datetime

from usermanagement.user_object_manager import CustomUserManager
from jsonfield import JSONField


# Create your models here.

def default_json():
    return []


class CustomUser(AbstractBaseUser):
    gender = (
        ('Male', 'Male'),
        ('Female', 'Female',),
        ('N/A', 'N/A')
    )
    active = (
        ('A', 'A'),
        ('I', 'I')
    )
    email = models.EmailField(unique=True)
    phone = models.CharField(db_column='phone', max_length=10, blank=True, null=True)
    firstname = models.CharField(db_column='firstName', max_length=16, blank=False, null=False)
    lastname = models.CharField(db_column='lastname', max_length=16, blank=True, null=True)
    gender = models.CharField(db_column='gender', max_length=10, blank=True, null=True, choices=gender)
    is_active = models.CharField(db_column='isActive', max_length=1, choices=active, default='A')
    created_at = models.DateTimeField(db_column='createdAt', default=datetime.now)
    modified_at = models.DateTimeField(db_column='modifiedAt', default=datetime.now)
    roles = JSONField(db_column='roles', default=['endUser'])

    objects = CustomUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = 'Users'
