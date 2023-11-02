from django.db.models import Q

from todomanagement.constants import TodoException, Constants
from todomanagement.models import Todos, Category
from todomanagement.todo_serializer import TodoSerializer
from utils.date_time import DateTime
from datetime import datetime, timedelta


class CRUDManager:

    def __init__(self, todo_id=None):
        if todo_id:
            try:
                self.todo = Todos.objects.get(id=todo_id)
            except Exception as e:
                raise TodoException('Todo doesnot exist')
        else:
            self.todo = Todos()

    def validate_todo_payload(self, payload, update=False):
        todo_name = payload.get('todoName', '').strip()

        if not update and not todo_name:
            raise TodoException('Todo is required')
        if todo_name:
            self.todo.todo_name = todo_name

        desc = payload.get('desc', '').strip()
        if desc:
            self.todo.desc = desc

        note = payload.get('note', '').strip()
        if note:
            self.todo.note = note

        due_date = payload.get('dueDate')
        if due_date:
            current_date = DateTime.get_current_date()
            if current_date > due_date:
                raise TodoException('Due date must be greater or equal to today')
            self.todo.due_date = due_date

        # if payload.get('todoType') not in Constants.ALL_TYPES:
        #     raise TodoException('Invalid type')

        is_important = payload.get('isImportant', False)
        if is_important:
            self.todo.is_important = is_important

        completed = payload.get('completed', False)
        if completed:
            self.todo.completed = completed

        category_id = payload.get('cateId')
        if category_id:
            try:
                category = Category.objects.get(id=category_id)
            except Exception as e:
                raise TodoException('Category doesnot exist')
            self.todo.cateid = category

    def add_todo(self, payload, request):
        if Todos.objects.filter(userid=request.user.id, todo_date=DateTime.get_current_date(),
                             todo_name=payload.get('todoName')).exists():
            raise TodoException('Todo already exists')
        self.validate_todo_payload(payload)
        self.todo.userid = request.user
        if payload.get('todoType') == Constants.my_day:
            self.todo.todo_date = DateTime.get_current_date()
        elif payload.get('todoType') == Constants.Important:
            self.todo.is_important = True
        self.todo.save()

    def update_todo(self, payload):
        self.validate_todo_payload(payload, True)
        self.todo.save()

    def delete_todo(self):
        self.todo.delete()

    @staticmethod
    def get_all_todos(filters, user_id):
        not_completed = []
        completed = []
        query = Q()
        search = filters.get('search', '').strip()
        query &= Q(userid=user_id)
        if search:
            query &= Q(todo_name__icontains=search)
        day_filter = filters.get('dayFilter', Constants.my_day)
        if day_filter == Constants.my_day:
            query &= Q(todo_date=DateTime.get_current_date())
        elif day_filter == Constants.Important:
            query &= Q(is_important=True)
        elif day_filter == Constants.Planned:
            query &= Q(todo_date__gt=DateTime.get_current_date())
        all_todos = Todos.objects.filter(query).order_by('-createdAt')
        serializerd_data = TodoSerializer(all_todos, many=True)
        for todo in serializerd_data.data:
            todo['my_day'] = True if (day_filter == Constants.my_day or
                                      (todo.get('todo_date') and
                                       DateTime.parse_sql_date(todo.get('todo_date')) == DateTime.get_current_date())) \
                else False
            if todo.get('completed'):
                completed.append(todo)
            else:
                not_completed.append(todo)
        return completed, not_completed, sum([len(completed), len(not_completed)])

    def markTodo(self, action_type):
        if action_type == Constants.IMPORTANT:
            self.todo.is_important = True
        elif action_type == Constants.NOT_IMPORTANT:
            self.todo.is_important = False
        elif action_type == Constants.COMPLETED:
            self.todo.completed = True
        elif action_type == Constants.NOT_COMPLETED:
            self.todo.completed = False
        self.todo.save()

    def add_or_remove_my_day(self, is_add):
        if not is_add:
            self.todo.todo_date = None
        else:
            self.todo.todo_date = DateTime.get_current_date()
        self.todo.save()
