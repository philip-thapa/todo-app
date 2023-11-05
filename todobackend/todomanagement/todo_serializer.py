from rest_framework import serializers

from todomanagement.models import Todos, TodoImages


class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todos
        fields = ('id', 'todo_name', 'desc', 'userid', 'cateid', 'is_important', 'due_date', 'completed', 'note',
                  'todo_date')


class TodoImageSerializer(serializers.ModelSerializer):

    class Meta:
        model = TodoImages
        fields = ('file_path')
