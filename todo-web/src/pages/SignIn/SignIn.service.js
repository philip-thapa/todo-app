import { Urls } from "../../const/urls";
import { HttpAxiosService } from "../../HttpAxiosService";
import { BASE } from "../../config/environment.config";

const authService = new HttpAxiosService(BASE);

export const signInService = (payload_data) => {
  authService.updateTokenAndInstances();
  return authService.post(Urls.LOGIN, payload_data);
};

export const signUpService = (payload_data) => {
  return authService.post(Urls.SIGN_UP, payload_data);
};

export const userDetailsService = (payload_data) => {
  authService.updateTokenAndInstances();
  return authService.get(Urls.GET_USER_DETAILS, payload_data);
};

export const verifyEmailOtpService = (payload_data) => {
  return authService.post(Urls.VERIFY_OTP, payload_data);
};