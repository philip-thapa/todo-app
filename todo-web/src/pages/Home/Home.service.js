import { Urls } from "../../const/urls";
import { HttpAxiosService } from "../../HttpAxiosService";
import { BASE } from "../../config/environment.config";

const todoService = new HttpAxiosService(BASE);

export const getAllTodosService = (filters) => {
  todoService.updateTokenAndInstances();
  return todoService.get(Urls.GET_ALL_TODOS, filters);
};

export const addTodoService = (payload) => {
  return todoService.post(Urls.ADD_TODO, payload);
};

export const signOut = () => {
  return todoService.get(Urls.SIGN_OUT);
};

export const markTodoService = (filters) => {
  return todoService.get(Urls.MARK_TODO, filters);
};

export const updateTodoService = (payload) => {
  return todoService.post(Urls.UPDATE_TODO, payload);
};

export const delTodoService = (filters) => {
  return todoService.get(Urls.DELETE_TODO, filters);
};

