import { Urls } from "../../const/urls";
import { HttpAxiosService } from "../../HttpAxiosService";
import { BASE } from "../../config/environment.config";

const authService = new HttpAxiosService(BASE);


export const generateOtpService = (payload_data) => {
  return authService.post(Urls.SEND_OTP, payload_data);
};

export const otpVerifyService = (payload_data) => {
  return authService.post(Urls.VERIFY_OTP, payload_data);
};

export const signUpService = (payload_data) => {
  return authService.post(Urls.SIGN_UP, payload_data);
};
