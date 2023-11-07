import { Urls } from "../../const/urls";
import { HttpAxiosService } from "../../HttpAxiosService";
import { BASE } from "../../config/environment.config";

const profile = new HttpAxiosService(BASE);

export const getMyProfileService = (filters) => {
    profile.updateTokenAndInstances();
    return profile.get(Urls.GET_MY_PROFILE, filters);
};

export const editMyProfileService = (payload) => {
    profile.updateTokenAndInstances();
    return profile.post(Urls.EDIT_PROFILE, payload);
};