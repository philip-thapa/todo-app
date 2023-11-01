from django.db import models

from usermanagement.models import CustomUser
from utils.custom_model import CustomModel


# Create your models here.

class Category(CustomModel):
    category_name = models.CharField(db_column='categoryName', max_length=16, unique=True)
    category_desc = models.TextField(db_column='description', null=True, blank=True)

    class Meta:
        db_table = 'Category'


class Todos(CustomModel):
    todo_name = models.CharField(db_column='todoName', max_length=56, null=False, blank=False)
    desc = models.TextField(db_column='description', null=True, blank=True)
    userid = models.ForeignKey(CustomUser, db_column='userId', on_delete=models.CASCADE, related_name='todo_userid')
    cateid = models.ForeignKey(Category, db_column='categoryId', on_delete=models.CASCADE, related_name='todo_cateid',
                               null=True, blank=True)
    is_important = models.BooleanField(db_column='isImportant', default=False)
    due_date = models.DateField(db_column='dueDate', null=True, blank=True)
    completed = models.BooleanField(db_column='completed', default=False)
    note = models.TextField(db_column='note', null=True, blank=True)
    todo_date = models.DateField(db_column='todoDate', auto_now_add=True)

    class Meta:
        db_table = 'Todos'
        unique_together = ('todo_date', 'todo_name')


class TodoImages(CustomModel):
    file_path = models.CharField(db_column="FilePath", max_length=200, null=True, blank=True)
    todo = models.ForeignKey(Todos, db_column='todoId', on_delete=models.CASCADE, related_name='todoimage_todoid')

    class Meta:
        db_table = 'TodoImages'


class MyDay(CustomModel):
    todo = models.ForeignKey(Todos, db_column='todoId', on_delete=models.CASCADE, related_name='myday_todoid')

    class Meta:
        db_table = 'MyDay'
