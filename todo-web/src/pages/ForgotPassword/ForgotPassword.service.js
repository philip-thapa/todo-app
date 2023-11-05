import { Urls } from "../../const/urls";
import { HttpAxiosService } from "../../HttpAxiosService";
import { BASE } from "../../config/environment.config";

const todoService = new HttpAxiosService(BASE);

export const forgotPasswordService = (filters) => {
  todoService.updateTokenAndInstances();
  return todoService.post(Urls.FORGOT_PASSWORD, filters);
};

export const resetPasswordService = (filters) => {
  todoService.updateTokenAndInstances();
  return todoService.post(Urls.RESET_PASSWORD, filters);
};