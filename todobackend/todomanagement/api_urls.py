from django.urls import path
from todomanagement.api_views import *

urlpatterns = [
    path(r'add-todo', AddTodo.as_view(), name='add-todo'),
    path(r'get-all-todos', GetAllTodos.as_view(), name='get-all-todos'),
    path(r'mark-todo', MarkTodo.as_view(), name='mark-todo'),
    path(r'update-todo', UpdateTodo.as_view(), name='update-todo'),
    path(r'delete-todo', DeleteTodo.as_view(), name='delete-todo'),
    path(r'add-my-day-todo', AddMyDay.as_view(), name='delete-todo')
]