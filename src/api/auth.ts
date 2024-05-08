 
import HttpClient from '@/http/http-client';
import {type AutoLoginResult ,type getTelephoneResult } from '@/model/userinfo';
import {type ApiResponse} from '@/model/common';

// 这里将API方法统一管理
export default class AuthApi {
  /**
   * 自动登录
   */
  static async wxAutoLogin(data: { code: string; direct?: boolean }): Promise<ApiResponse<AutoLoginResult>>  {
    return  await HttpClient.getAxiosInstance().post('login', data);
  }

  
  static async wxGetTelephone(data: { code: string ; openid:string }): Promise<ApiResponse<getTelephoneResult>>  {
    return  await HttpClient.getAxiosInstance().post('gettelephone', data);
  }

  // /**
  //  * 验证用户手机号
  //  */
  // static async validateUserMobile(data: MPMemberDetail): ApiPromise<AutoLoginResult> {
  //   return await http.server().post('members/mobileLogin', data)
  // }

  // /**
  //  * 获取当前用户
  //  */
  // static async getCurrentMember(): ApiPromise<Member> {
  //   return await http.server().post('members/current')
  // }
}
