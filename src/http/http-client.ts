import axios , {type AxiosInstance , type InternalAxiosRequestConfig ,type AxiosResponse} from 'axios';
import { uniAdapter } from 'fant-axios-adapter';
import AxiosCancelToken from './axios-cancel-token';
import useAuthUserStore from '@/store/auth-user';

const axiosCancelToken = new AxiosCancelToken();
axios.defaults.timeout = 30000;
export default class HttpClient {
  /**
   * 创建axios
   * @param abortRequest 取消请求配置，可选值：same(取消相同请求)、all(取消所有请求)、none(不取消请求)
   * @returns
   */

  private static axiosInstance: AxiosInstance | null = null;

  public static getAxiosInstance(abortRequest: 'same' | 'all' | 'none' = 'none'): AxiosInstance {
    if (!HttpClient.axiosInstance) {
      const baseURL = "http://127.0.0.1:10088/";
      HttpClient.axiosInstance = HttpClient.create(baseURL, abortRequest);
    }
    return HttpClient.axiosInstance;
  }

  private static create(baseURL: string, abortRequest: 'same' | 'all' | 'none' = 'none') {

    const instance : AxiosInstance = axios.create({ 
        withCredentials: true,
        baseURL: baseURL,
        adapter: uniAdapter // 指定适配器
      });
 
    instance.interceptors.request.use( 
       ( request:InternalAxiosRequestConfig ) => {
        // 添加小程序端请求头标识

        Object.assign(request.headers, {
          ...request.headers,
          'source-client': 'miniapp',
          'Content-Type': 'application/json',
          traceId: new Date().getTime(),
        });

        //添加 token 请求头标识
        const { profile } = useAuthUserStore();
        if (profile.auth_token) {
          request.headers['auth-token'] = profile.auth_token;
        }

        switch (abortRequest) {
          case 'all':
            axiosCancelToken.removeAllRequest();
            break
          case 'same':
            axiosCancelToken.removeRequest(request);
            break
          default:
            break
        }
        axiosCancelToken.addRequest(request);
        return request;
      },
      (error:any) => {
        return Promise.reject(error);// 这里回引起catch，post时的catch里处理。
      }
    );

    instance.interceptors.response.use(
      (response : AxiosResponse) => {
        if (response && response.request) 
          axiosCancelToken.removeRequest(response.request);

        // 此处为前后端约定的接口成功的字段，旨在处理状态码为200的错误响应，开发者可自行调整
        if (response.data.code === 1) 
          return response.data;

        if (response.data.code === 303) {
          const pages  = getCurrentPages() as any[];
          
          const authUserStore = useAuthUserStore();
          authUserStore.logout();
          console.log('==== logout when 303');
          
          // setTimeout(() => {
          //   uni.showToast({ title: '登录已过期,请重新登录!', icon: 'none' })
          // }, 300);
          
          // 如果当前页面不是登录页面则跳转至登录页面
          if (!pages[pages.length - 1].$page || 
              (pages[pages.length - 1].$page && pages[pages.length - 1].$page.fullPath !== '/pages/mycenter/index')) {
            uni.reLaunch({ url: '/pages/mycenter/index' })
          }
         
        } 
        

        const error: Record<string, any> = {};
        if (response.data.code) {
            error.code = response.data.code;
        }
        if (response.data.msg) {
            error.message = response.data.msg;
        } else {
            error.message = response.status;
        }
        error.response = response.data;

        uni.showToast({
            icon: 'none',
            title: error.message,
            duration:3000
        })

        return Promise.reject(error);
        
      },
      (error) => {
        if (error.status !== 0 && !error.status) {
          const newError = error as any
          newError.msg = newError.errMsg || '请检查网络设置'
          return Promise.reject(newError)
        }
        const pages = getCurrentPages() as any[]
        const oauthStore = useAuthUserStore()
        switch (error.status) {
          // 小程序切换页面会导致正在处理中的请求返回状态码为0 这里还没有什么比较好的处理方案
          // case 0:
          //   error.msg = '请检查网络设置'
          //   break
          case 1:
            error.msg = '网络超时!'
            break
          case 204:
            if (error.config.url == 'members/current') {
              // 如果数据库用户表清理了，那么会返回204
              console.log('==== logout when 204')
              oauthStore.logout()
              setTimeout(() => {
                uni.showToast({ title: '用户记录不存在,请重新登录!', icon: 'none' })
              }, 300)
              // 如果当前页面不是登录页面则跳转至登录页面
              if (
                !pages[pages.length - 1].$page ||
                (pages[pages.length - 1].$page && pages[pages.length - 1].$page.fullPath !== '/pages/login/Login')
              ) {
                uni.reLaunch({ url: '/pages/login/Login' })
              }
            }
            break
          case 401:
            console.log('==== logout when 401')
            oauthStore.logout()
            setTimeout(() => {
              uni.showToast({ title: '登录已过期,请重新登录!', icon: 'none' })
            }, 300)
            // 如果当前页面不是登录页面则跳转至登录页面
            if (
              !pages[pages.length - 1].$page ||
              (pages[pages.length - 1].$page && pages[pages.length - 1].$page.fullPath !== '/pages/login/Login')
            ) {
              uni.reLaunch({ url: '/pages/login/Login' })
            }
            break

          case 403:
            error.msg = `${error.status} 禁止访问!`
            break
          case 500:
            error.msg = `${error.status} 服务内部异常!`
            break
          case 502:
            error.msg = `${error.status} 服务器暂不可用!`
            break
          case 503:
            error.msg = `${error.status} 服务器升级中!`
            break
          case 404:
            error.msg = `${error.status} 服务器无回应!`
            break
          default:
            error.msg = `${error.status} 未知错误!`
        }
        return Promise.reject(error)
      }
    );

    return instance ;
  }
}
