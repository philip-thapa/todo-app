from rest_framework.response import Response
from rest_framework.views import APIView

from todomanagement.constants import TodoException
from todomanagement.todo_manager import CRUDManager


class AddTodo(APIView):

    def post(self, request):
        try:
            payload = request.data
            CRUDManager().add_todo(payload, request)
            return Response({'success': True}, 200)
        except TodoException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500)


class UpdateTodo(APIView):

    def post(self, request):
        try:
            payload = request.data
            CRUDManager(payload.get('todoId')).update_todo(payload)
            return Response({'success': True}, 200)
        except TodoException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500)


class DeleteTodo(APIView):

    def get(self, request):
        try:
            filters = request.query_params
            CRUDManager(filters.get('todoId')).delete_todo()
            return Response({'msg': 'success'}, 200)
        except TodoException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500)


class GetAllTodos(APIView):

    def get(self, request):
        try:
            filters = request.query_params
            user_id = request.user.id
            completed, not_completed, total = CRUDManager.get_all_todos(filters, user_id)
            return Response({'completed': completed, 'not_completed': not_completed,
                             'total': total}, 200)
        except TodoException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500)


class MarkTodo(APIView):

    def get(self, request):
        try:
            filters = request.query_params
            CRUDManager(filters.get('id')).markTodo(filters.get('type'))
            return Response({'msg': 'success'}, 200)
        except TodoException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500)


class AddRemoveMyDay(APIView):

    def get(self, request):
        try:
            filters = request.query_params
            is_add = filters.get('isAdd')
            CRUDManager(filters.get('todoId')).add_or_remove_my_day(is_add)
            return Response({'msg': 'success'}, 200)
        except TodoException as e:
            return Response(str(e), 400)
        except Exception as e:
            return Response(str(e), 500)
