import type { WXUser, getTelephoneResult ,AutoLoginResult } from "@/model/userinfo";
import {defineStore} from "pinia";
import { ref , reactive , computed } from "vue"; 
import AuthApi from "@/api/auth";
import {type ApiResponse} from '@/model/common';

const useAuthUserStore = defineStore("authUserStore", ()=>{

  //const auth_token = ref<string>("");
  //const openid = ref<string>("");
  
  let profile = ref<WXUser>({});
  const loading = ref(false);
     
   // 保存会员信息，登录时使用
   function setProfile(val: WXUser){
    Object.assign( profile.value , val);
   }

   function setAvatar(avatarUrl:string){
    profile.value.avatarUrl = avatarUrl; 
   }

   function setNickname(nickname:string){
    profile.value.nickName = nickname; 
   }

   // 清理会员信息，退出时使用
   function clearProfile(){
     profile.value = {};
     //auth_token.value = undefined;
   };

  async function getTelephone(code:string, openid:string) : Promise<string | undefined> {
   
    let apiRes:ApiResponse<getTelephoneResult> ={};
    try {
      apiRes = await AuthApi.wxGetTelephone({ code: code , openid: openid });
    
      if (apiRes && apiRes.data)  
        { 
          setProfile(apiRes.data);

          return profile.value.telephone;
        } 
        console.log("login res:%s", JSON.stringify(apiRes) );    
    } catch (error:any) {
       let msg : string = error.msg ;
       console.log("Error wxGetTelephone :%s", msg);
    } 
  }

   async function autoLogin() : Promise<boolean> {
     if (loading.value) 
      return false;
      
     loading.value = true;
 
     uni.login({
        provider:"weixin",
        scopes:"auth_user",
        onlyAuthorize:true,
        success: async (res) => {          

          let apiRes:ApiResponse<AutoLoginResult> ={};
          try {
            apiRes = await AuthApi.wxAutoLogin({ code: res.code, direct: true });
          
            if (apiRes && apiRes.data)  
              { 
                setProfile(apiRes.data);
                //auth_token.value  = apires.data.auth_token;
                //openid.value      = apires.data.openid;
              } 
              console.log("login res:%s", JSON.stringify(apiRes) );    
          } catch (error:any) {
             let msg : string = error.msg ;
             console.log("Error wxlogin :%s", msg);
          }
         
          
          loading.value = false;
          return true;
        },
        fail: (err) => {
          console.log(err);
          loading.value = false;
          return false;
        }
      });
      return true;
   }
   
   function logout(){
    clearProfile();
    }

   return {profile,setProfile,setAvatar,setNickname,clearProfile,autoLogin,getTelephone,logout };
 
},
{
    // 网页端配置 pinia-plugin-persistedstate store的持久化
    // persist: true,
    // 小程序端配置
    persist: {
      storage: {
        getItem(key) {
          return uni.getStorageSync(key);
        },
        setItem(key, value) {
          uni.setStorageSync(key, value);
        }
      }
    }
}
);

export default useAuthUserStore ;
