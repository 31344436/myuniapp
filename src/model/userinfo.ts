
// export interface AuthonUser  {
//   id: number;
//   username: string;
//   nickname: string;
//   email: string;
//   avatar?: string;
// }




export interface WXUser  {
  openid?:string;
  session_key?:string;
  unionid?:string;
  auth_token?:string;

  telephone?:string;
  nickName?: string;
  avatarUrl?:string;

  gender?: string;
  language?: string;
  city?: string;
  province?:string;
  country?:string;
}

 
export interface AutoLoginResult  {
  openid: string;
  auth_token:string;
  unionid?:string;

  telephone?:string;
  nickName?: string;
  avatarUrl?:string;

  gender?: string;
  language?: string;
  city?: string;
  province?:string;
  country?:string;
}

export interface getTelephoneResult  {
  telephone: string;
}
