from datetime import datetime
from django.db import models


class CustomManager(models.Manager):
    def get_queryset(self):
        return super(CustomManager, self).get_queryset().filter(isDeleted=False)


class CustomModel(models.Model):
    createdAt = models.DateTimeField(default=datetime.now)  # Need to check this auto_now_add option
    modifiedAt = models.DateTimeField(default=datetime.now)
    isDeleted = models.BooleanField(default=False)
    objects = CustomManager()

    class Meta:
        abstract = True

    def save(self, *args, **kwargs):
        if not self.id or not self.createdAt:
            self.createdAt = datetime.now()
        self.modifiedAt = datetime.now()
        super(CustomModel, self).save(*args, **kwargs)

    def delete(self, *args, **kwargs):
        self.isDeleted = True
        super(CustomModel, self).save(*args, **kwargs)

    def hard_delete(self, *args, **kwargs):
        super(CustomModel, self).delete(*args, **kwargs)