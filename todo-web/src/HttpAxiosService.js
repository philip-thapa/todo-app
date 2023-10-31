import axios from "axios";
import {getToken} from './authHelper'


export class HttpAxiosService {
  
  axiosInstance;
  axiosMuliPartInstance;

  constructor(baseURL) {
    this.setupAxiosInstances(baseURL);
  }

  async setupAxiosInstances(baseURL) {
    var token = ''
    try{
      token = await getToken();
    } catch (error){
      return Promise.reject(error)
      // console.log(error)
    }
    
    this.axiosInstance = axios.create({
      baseURL: baseURL,
      withCredentials: true,
      xsrfHeaderName: 'X-CSRFToken',
      xsrfCookieName: 'csrftoken',
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
      }
    });

    this.axiosMuliPartInstance = axios.create({
      baseURL: baseURL,
      withCredentials: true,
      xsrfHeaderName: 'X-CSRFToken',
      xsrfCookieName: 'csrftoken',
      headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + token
      }
    });
  }

  get(url, params) {
    return {
      axiosInstance: this.axiosInstance,
      method: "get",
      url: url,
      requestConfig: {
        params: params,
      },
    };
  }
  fileDownload(url, params) {
    return {
      axiosInstance: this.axiosInstance,
      method: "get",
      url: url,
      requestConfig:  {params, responseType: "blob" },
    };
  }
  post(url, data) {
    return {
      axiosInstance: this.axiosInstance,
      method: "post",
      url: url,
      requestConfig: data
    };
  }

  multiPartFormData(url, data) {
    return {
      axiosInstance: this.axiosMuliPartInstance,
      method: "post",
      url: url,
      requestConfig: data
    };
  }
  
}
